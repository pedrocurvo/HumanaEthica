<template>
  <div>
    <v-card class="table">
      <v-data-table
        :headers="headers"
        :items="activities"
        :search="search"
        disable-pagination
        :hide-default-footer="true"
        :mobile-breakpoint="0"
        data-cy="volunteerActivitiesTable"
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
          </v-card-title>
        </template>
        <template v-slot:[`item.themes`]="{ item }">
          <v-chip v-for="theme in item.themes" v-bind:key="theme.id">
            {{ theme.completeName }}
          </v-chip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip v-show="item.state === 'APPROVED'" bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                class="mr-2 action-button"
                color="red"
                v-on="on"
                data-cy="reportButton"
                @click="reportActivity(item)"
                >warning</v-icon
              >
            </template>
            <span>Report Activity</span>
          </v-tooltip>
          <v-tooltip v-if="item.state === 'APPROVED' && !verifyInvariants(item)" bottom> 
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="mr-2 action-button"
                color="blue"
                data-cy="applyButton"
                @click="newEnrollment(item)"
              >
                mdi-login
              </v-icon>
            </template>
            <span>Apply for Activity</span>
          </v-tooltip>
        </template>
      </v-data-table>

      <enrollment-dialog
        v-if="currentActivity && editEnrollmentDialog"
        v-model="editEnrollmentDialog"
        :enrollment="currentEnrollment"
        :activity="currentActivity"
        v-on:save-enrollment="onSaveEnrollment"
        v-on:close-enrollment-dialog="onCloseEnrollmentDialog"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RemoteServices from '@/services/RemoteServices';
import Activity from '@/models/activity/Activity';
import { show } from 'cli-cursor';
import Volunteer from '@/models/volunteer/Volunteer';
import Enrollment from '@/models/enrollment/Enrollment';
import EnrollmentDialog from '@/views/volunteer/EnrollmentDialog.vue';

@Component({
  methods: { show },
  components: {
    'enrollment-dialog': EnrollmentDialog,
  },
})
export default class VolunteerActivitiesView extends Vue {
  activities: Activity[] = [];
  enrollments: Enrollment[] = [];

  currentEnrollment: Enrollment | null = null;
  currentActivity: Activity | null = null;
  editEnrollmentDialog: boolean = false;

  search: string = '';
  headers: object = [
    {
      text: 'Name',
      value: 'name',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Region',
      value: 'region',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Participants',
      value: 'participantsNumberLimit',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Themes',
      value: 'themes',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Description',
      value: 'description',
      align: 'left',
      width: '30%',
    },
    {
      text: 'State',
      value: 'state',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Start Date',
      value: 'formattedStartingDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'End Date',
      value: 'formattedEndingDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Application Deadline',
      value: 'formattedApplicationDeadline',
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
    await this.$store.dispatch('loading');
    try {
      this.activities = await RemoteServices.getActivities();
      this.enrollments = await RemoteServices.getVolunteerEnrollments();
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }

  async reportActivity(activity: Activity) {
    if (activity.id !== null) {
      try {
        const result = await RemoteServices.reportActivity(
          this.$store.getters.getUser.id,
          activity.id,
        );
        this.activities = this.activities.filter((a) => a.id !== activity.id);
        this.activities.unshift(result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }

  verifyInvariants(activity: Activity) {
      console.log('verifyInvariants')
      const now = new Date();
      const applicationDeadline = new Date(activity.applicationDeadline);
      const applied = this.enrollments.some(enrollment => enrollment.activityId == activity.id);
      if (applied == true || now > applicationDeadline) {
        console.log('hasAlreadyApplied: true')
        return true;
      }
      else {
        console.log('enrollmentPeriod: false')
        return false;
      }
    }

  newEnrollment(activity: Activity){
    this.currentActivity = activity;
    this.currentEnrollment = new Enrollment();
    this.currentEnrollment.activityId = activity.id;
    this.currentEnrollment.volunteerId = this.$store.getters.getUser.id;
    this.editEnrollmentDialog = true;
  }

  onCloseEnrollmentDialog() {
    this.currentEnrollment = null;
    this.currentActivity = null;
    this.editEnrollmentDialog = false;
  }

  async onSaveEnrollment(enrollment: Enrollment) {
    this.editEnrollmentDialog = false;
    this.currentActivity = null;
    this.currentEnrollment = null;
    window.location.reload();
  }

}
</script>

<style lang="scss" scoped></style>
