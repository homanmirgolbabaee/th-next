export interface Schedule {
    id: string;
    user_id: string;
    chat_id: string;
    created_at: string;
    updated_at: string;
    last_ran_at: string;
    active: boolean;
    archived: boolean;
    cadence: string | null;
    bundle: string;
    toolhouse_id: string;
  }
  
  export interface ScheduleCreateRequest {
    chat_id: string;
    cadence: string;
    bundle: string;
    toolhouse_id?: string;
  }
  
  export interface ScheduleUpdateRequest {
    cadence?: string;
    active?: boolean;
    bundle?: string;
    toolhouse_id?: string;
  }
  
  export interface ScheduleResponse {
    data: Schedule[];
    status: 'success' | 'error';
    message?: string;
  }