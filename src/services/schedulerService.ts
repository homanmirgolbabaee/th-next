// src/services/schedulerService.ts

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

class SchedulerService {
  private baseUrl = 'https://api.toolhouse.ai/v1';
  
  private getHeaders() {
    const token = process.env.NEXT_PUBLIC_TOOLHOUSE_API_KEY;
    if (!token) {
      console.error('API key not found');
      throw new Error('NEXT_PUBLIC_TOOLHOUSE_API_KEY is not set');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  }

  async convertToCron(text: string): Promise<string> {
    try {
      console.log('Converting to cron:', text);
      const response = await fetch(
        `${this.baseUrl}/schedules/text-to-cron?cron=${encodeURIComponent(text)}`,
        { headers: this.getHeaders() }
      );
      
      const data = await this.handleResponse<{ cron: string }>(response);
      console.log('Cron conversion result:', data);
      return data.cron;
    } catch (error) {
      console.error('Convert to cron error:', error);
      throw error;
    }
  }

  async createSchedule(request: ScheduleCreateRequest): Promise<Schedule> {
    try {
      console.log('Creating schedule:', request);
      const response = await fetch(`${this.baseUrl}/schedules`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request)
      });

      const data = await this.handleResponse<Schedule>(response);
      console.log('Schedule created:', data);
      return data;
    } catch (error) {
      console.error('Create schedule error:', error);
      throw error;
    }
  }

  async listSchedules(): Promise<ScheduleResponse> {
    try {
      console.log('Fetching schedules...');
      const response = await fetch(`${this.baseUrl}/schedules`, {
        headers: this.getHeaders()
      });

      const data = await this.handleResponse<ScheduleResponse>(response);
      console.log('Schedules fetched:', data);
      return data;
    } catch (error) {
      console.error('List schedules error:', error);
      throw error;
    }
  }

  async getSchedule(scheduleId: string): Promise<Schedule> {
    try {
      console.log('Fetching schedule:', scheduleId);
      const response = await fetch(`${this.baseUrl}/schedules/${scheduleId}`, {
        headers: this.getHeaders()
      });

      const data = await this.handleResponse<Schedule>(response);
      console.log('Schedule fetched:', data);
      return data;
    } catch (error) {
      console.error('Get schedule error:', error);
      throw error;
    }
  }

  async updateSchedule(scheduleId: string, request: ScheduleUpdateRequest): Promise<Schedule> {
    try {
      console.log('Updating schedule:', scheduleId, request);
      const response = await fetch(`${this.baseUrl}/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(request)
      });

      const data = await this.handleResponse<Schedule>(response);
      console.log('Schedule updated:', data);
      return data;
    } catch (error) {
      console.error('Update schedule error:', error);
      throw error;
    }
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    try {
      console.log('Deleting schedule:', scheduleId);
      const response = await fetch(`${this.baseUrl}/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      await this.handleResponse<void>(response);
      console.log('Schedule deleted successfully');
    } catch (error) {
      console.error('Delete schedule error:', error);
      throw error;
    }
  }

  async calculateNextRun(cronExpression: string | null): Promise<Date | null> {
    if (!cronExpression) return null;
    
    try {
      const parts = cronExpression.split(' ');
      const minutesPart = parts[0].replace('*/', '');
      const minutes = parseInt(minutesPart) || 1;
      
      // Simple estimation based on cron expression
      const now = new Date();
      return new Date(now.getTime() + minutes * 60000);
    } catch (error) {
      console.error('Calculate next run error:', error);
      return null;
    }
  }
}

export const schedulerService = new SchedulerService();