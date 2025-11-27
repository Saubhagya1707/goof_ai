
export interface ToolOut {
  name: string;
  description: string;
  logo_uri: string
}
export interface UserBasic {
  id: number;
  email: string;
  username?: string; // if present in backend
}

export type FrequencyEnum =
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | null;

export interface Agent {
  id: number
  name: string;
  base_prompt: string;
  is_scheduled: boolean;
  frequency: FrequencyEnum | null;
  owner_id: number | null;
  owner: UserBasic | null;
  tools: ToolOut[];
  active: boolean;
  last_executed: Date
  created_at: Date
  updated_at: Date
}

export interface AgentExecution {
  id: number
  agent: Agent
  started_at: Date
  completed_at: Date
  status: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  size: number
  total: number
}
