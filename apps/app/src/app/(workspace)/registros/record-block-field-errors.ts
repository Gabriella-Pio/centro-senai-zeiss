export type RecordBlockAFieldErrors = {
  hoursPackageRef?: string;
  estimatedHours?: string;
  proposedValue?: string;
  priceOverrideReason?: string;
  stages?: string;
};

export type RecordBlockBFieldErrors = {
  stages?: string;
  billedValue?: string;
};

export type RecordBlockCFieldErrors = {
  deviationCauseId?: string;
  lesson?: string;
};
