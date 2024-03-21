<template>
  <v-card class="table">
    <div class="text-h3">{{ activity.name }}</div>
    <v-data-table
      :headers="headers"
      :items="enrollments"
      :search="search"
      disable-pagination
      :hide-default-footer="true"
      :mobile-breakpoint="0"
      data-cy="activityEnrollmentsTable"
    >
      <template v-slot:top>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            class="mx-2"
          />
          <v-spacer />
          <v-btn
            color="primary"
            dark
            @click="getActivities"
            data-cy="getActivities"
            >Activities</v-btn
          >
        </v-card-title>
      </template>     
  </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RemoteServices from '@/services/RemoteServices';
import Activity from '@/models/activity/Activity';
import Enrollment from '@/models/enrollment/Enrollment';

@Component({})
export default class InstitutionActivityEnrollmentsView extends Vue {
  activity!: Activity;
  enrollments: Enrollment[] = [];
  search: string = '';

  headers: object = [
    {
      text: 'Name',
      value: 'volunteerName' ,
      align: 'left',
      width: '5%',
    },  
    {
      text: 'Motivation',
      value: 'motivation',
      align: 'left',
      width: '50%',
    },
    {
      text: 'Participating',
      value: 'participating',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Application Date',
      value: 'enrollmentDateTime',
      align: 'left',
      width: '5%',
    },
  
  ];

  async created() {
    this.activity = this.$store.getters.getActivity;
    if (this.activity !== null && this.activity.id !== null) {
      await this.$store.dispatch('loading');
      try {
        this.enrollments = await RemoteServices.getActivityEnrollments(
          this.activity.id,
        );
        } catch (error) {
        await this.$store.dispatch('error', error);
      }
      await this.$store.dispatch('clearLoading');
    }
  }

//   async created() {
//   this.activity = this.$store.getters.getActivity;
//   if (this.activity && this.activity.id) {
//     await this.$store.dispatch('loading');
//     try {
//       let enrollments = await RemoteServices.getActivityEnrollments(this.activity.id);
//       // Fetch volunteer names for each enrollment
//       this.enrollments = await Promise.all(enrollments.map(async (enrollment: Enrollment) => {
//       try {
//         const volunteer = await RemoteServices.getVolunteerById(enrollment.volunteerId);
//         return { ...enrollment, volunteerName: volunteer.name };
//         } catch (error) {
//           console.error("Failed to fetch volunteer name", error);
//           return { ...enrollment, volunteerName: "Unknown" }; // Handle error case
//         }
//       }));
//     } catch (error) {
//       console.error('Failed to fetch enrollments', error);
//       this.$store.dispatch('error', error);
//     }
//     this.$store.dispatch('clearLoading');
//   }
// }

// getName() { console.log("1234567"); return "nome";}

  // async fetchVolunteerName(volunteerId: number){
  //   const volunteer = await RemoteServices.getVolunteerById(volunteerId);
  //   console.log(volunteer.name);
  //   return volunteer.name;
  // }

  async getActivities() {
    await this.$store.dispatch('setActivity', null);
    this.$router.push({ name: 'institution-activities' }).catch(() => {});
  }

  activityLimitReached() {
    return this.activity.participantsNumberLimit == this.activity.participations.length;
  }

}

</script>

<style lang="scss" scoped>
.date-fields-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.date-fields-row {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
</style>
