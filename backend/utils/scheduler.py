import time
import threading
from utils.db import SessionLocal
from models.db import Agent
import logging
from service.agent import AgentExecutor
# Configure root logging once and get a module logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Thread handle so repeated start_scheduler() calls are idempotent
_scheduler_thread = None

async def run_agents_by_frequency(frequency):
    db = SessionLocal()
    try:
        agents = db.query(Agent).filter(Agent.frequency == frequency).all()
        for agent in agents:
            try:
                logger.info("Running agent %s with frequency %s", agent.name, frequency)
                executor = AgentExecutor(agent=agent, db=db)
                await executor.execute()
                # TODO: place actual agent execution logic here
            except Exception:
                logger.exception("Error running agent %s (frequency=%s)", agent.name, frequency)
    except Exception:
        logger.exception("Error querying agents for frequency %s", frequency)
    finally:
        db.close()

async def scheduler_loop():
    while True:
        # Every minute
        await run_agents_by_frequency('every_minute')
        # Every hour
        if time.localtime().tm_min == 0:
            await run_agents_by_frequency('hourly')
        # Every day
        if time.localtime().tm_hour == 0 and time.localtime().tm_min == 0:
            await run_agents_by_frequency('daily')
        # Every week (Sunday 00:00)
        if time.localtime().tm_wday == 6 and time.localtime().tm_hour == 0 and time.localtime().tm_min == 0:
            await run_agents_by_frequency('weekly')
        time.sleep(60*5)

def start_scheduler():
    global _scheduler_thread
    if _scheduler_thread and _scheduler_thread.is_alive():
        logger.info("Scheduler already running, skipping start.")
        return

    logger.info("Starting scheduler...")

    def run_async_loop():
        import asyncio
        asyncio.run(scheduler_loop())   # runs async function properly

    _scheduler_thread = threading.Thread(target=run_async_loop, daemon=True)
    _scheduler_thread.start()
