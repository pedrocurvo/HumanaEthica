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
    <template v-slot:[`item.action`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="!item.participating && !activityLimitReached()"
            class="mr-2 action-button"
            @click="selectParticipant(item)"
            v-on="on"
            data-cy="selectParticipant"
            >mdi-check
          </v-icon>
        </template>
        <span>Select Participant</span>
      </v-tooltip>
    </template>
  </v-data-table>
    <participation-dialog
        v-if="currentParticipation && editParticipationSelectionDialog"
        v-model="editParticipationSelectionDialog"
        :participation="currentParticipation"
        v-on:make-participation="onMakeParticipation"
        v-on:update-enrollments="updateEnrollments"
        v-on:close-participation-dialog="onCloseParticipationDialog"
    />
  </v-card>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RemoteServices from '@/services/RemoteServices';
import Activity from '@/models/activity/Activity';
import Enrollment from '@/models/enrollment/Enrollment';
import ActivityDialog from '@/views/member/ActivityDialog.vue';
import ParticipationSelectionDialog from '@/views/member/ParticipationSelectionDialog.vue';
import Participation from '@/models/participation/Participation';
import Institution from '@/models/institution/Institution';

@Component({
  components: {
    'activity-dialog': ActivityDialog,
    'participation-dialog': ParticipationSelectionDialog,
  },
})
export default class InstitutionActivityEnrollmentsView extends Vue {
  activity!: Activity;
  enrollments: Enrollment[] = [];
  participations: Participation[] = [];
  search: string = '';

  editParticipationSelectionDialog: boolean = false;
  currentParticipation: Participation | null = null;


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
    {
      text: 'Actions',
      value: 'action',
      align: 'left',
      sortable: false,
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
        this.participations = await RemoteServices.getActivityParticipations(
          this.activity.id
        );
        } catch (error) {
        await this.$store.dispatch('error', error);
      }
      await this.$store.dispatch('clearLoading');
    }
  }

  async getActivities() {
    await this.$store.dispatch('setActivity', null);
    this.$router.push({ name: 'institution-activities' }).catch(() => {});
  }

  selectParticipant(participation: Participation) {
    this.currentParticipation = participation;
    this.editParticipationSelectionDialog = true;
  }

  onCloseParticipationDialog() {
    this.currentParticipation = null;
    this.editParticipationSelectionDialog = false;
  }

  async onMakeParticipation(participation: Participation) {
    this.participations.unshift(participation);
    this.editParticipationSelectionDialog = false;
    this.currentParticipation = null;
    this.activity.numberOfParticipations++;
  }

  updateEnrollments(participation: Participation) {
    this.enrollments = this.enrollments.map((enrollment) => {
      if (enrollment.activityId === participation.activityId && enrollment.volunteerId === participation.volunteerId) {
        enrollment.participating = true;
      }
      return enrollment;
    });
  }

  //invariant to show (or not) button to select participant
  activityLimitReached() {
    return this.activity.participantsNumberLimit == this.participations.length;
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

