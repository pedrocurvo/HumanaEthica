import { ISOtoString } from '@/services/ConvertDateService';

export default class Enrollment {
  id: number | null = null;
  volunteerId: number | null = null;
  activityId: number | null = null;
  motivation!: string;
  enrollmentDateTime!: string;

  constructor(jsonObj?: Enrollment) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.volunteerId = jsonObj.volunteerId;
      this.activityId = jsonObj.activityId;
      this.motivation = jsonObj.motivation;
      this.enrollmentDateTime = ISOtoString(jsonObj.enrollmentDateTime);
    }
  }
}
