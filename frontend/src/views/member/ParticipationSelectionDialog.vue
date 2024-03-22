<template>
  <v-dialog v-model="dialog" persistent width="600">
    <v-card>
      <v-card-title>
        <span class="headline">Select Participant</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  label="Rating"
                  :rules="[
                  (v) =>
                    (!v || v === '' || isNumberValid(v)) ||
                    'Leave blank or add a rating between 1 and 5',
                  ]"
                  v-model="editParticipation.rating"
                  data-cy="participantionRating"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue-darken-1"
            variant="text"
            @click="$emit('close-participation-dialog')"
        >
          Close
        </v-btn>
        <v-btn
            color="blue-darken-1"
            variant="text"
            @click="makeParticipation"
            data-cy="makeParticipation"
        >
          Make Participant
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator';
import Activity from '@/models/activity/Activity';
import Theme from '@/models/theme/Theme';
import Participation from '@/models/participation/Participation';
import Enrollment from '@/models/enrollment/Enrollment';
import RemoteServices from '@/services/RemoteServices';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import { ISOtoString } from '@/services/ConvertDateService';

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
@Component({
  methods: { ISOtoString },
})
export default class ParticipationDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: Participation, required: true }) readonly participation!: Participation;
  @Prop({ type: Enrollment, required: true }) readonly enrollment!: Enrollment;

  editParticipation: Participation = new Participation();
  editEnrollment: Enrollment = new Enrollment();

  cypressCondition: boolean = false;


  async created() {
    this.editParticipation = new Participation(this.participation);
    this.editEnrollment = new Enrollment(this.enrollment);
  }

  isNumberValid(value: any) {
    value = value?.trim();

    if (value === undefined ) return true;

    if (value === null || value === '') return true;

    if (!/^\d+$/.test(value)) return false;
    const parsedValue = parseInt(value);
    return parsedValue >= 1 && parsedValue <= 5;
  }

  get canSave(): boolean {
    return (
        this.cypressCondition ||
        (!!this.editParticipation.rating)
    );
  }

  // [BS] when press makeparticipation:
  async makeParticipation() {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      try {

        let result = null;

        // [BS] add a participation (participating) to activity (change # of participants)
        if (this.editParticipation && this.editParticipation.volunteerId && this.editParticipation.activityId) {
          result = await RemoteServices.makeParticipation(
              this.editParticipation.volunteerId,
              this.editParticipation.activityId,
          );
        }
        // [BS] update volunteer enrollment (participating) from false to true
        if (this.enrollment && this.enrollment.id) {
          await RemoteServices.updateEnrollment(
              this.enrollment.id
          );
        }

        this.$emit('make-participation', result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }


}
</script>

<style scoped lang="scss"></style>

