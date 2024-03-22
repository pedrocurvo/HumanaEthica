import { ISOtoString } from '@/services/ConvertDateService';
import Participation from '@/models/participation/Participation';

export default class Enrollment {
  id: number | null = null;
  motivation!: string;
  enrollmentDateTime!: string;
  volunteerId!: number;
  volunteerName: string | null = null;
  participating: boolean = false;
  participations!: Participation[];

  constructor(jsonObj?: Enrollment) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.motivation = jsonObj.motivation;
      this.enrollmentDateTime = ISOtoString(jsonObj.enrollmentDateTime);
      this.volunteerId = jsonObj.volunteerId;
      this.volunteerName = jsonObj.volunteerName;
      this.participating = jsonObj.participating;
      this.participations = jsonObj.participations.map((participations: Participation) => {
        return new Participation(participations);
      });
    }
  }
}