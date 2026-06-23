export interface CollectionTransaction {
  id: string;
  amount: string | number;
  type: string;
  receiptPayload?: any;
}

export interface CreateCollectionPayload {
  clientId: string;
  localRef: string;
  type: string;
  amount: number;
  latitude?: number;
  longitude?: number;
  note?: string;
}

export interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface CreateSchedulePayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateSchedulePayload extends Partial<CreateSchedulePayload> {
  isActive?: boolean;
}
