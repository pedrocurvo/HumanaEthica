<template>
  <v-dialog v-model="dialog" persistent width="1300">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{
            editEnrollment && editEnrollment.id === null
                ? 'New Enrollment'
                : 'Edit Enrollment'
          }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                  label="*Motivation"
                  :rules="[
                            (v) => !!v || 'Enrollment motivation is required',
                            (v) => (v && v.length >= 10) || 'Motivation must be at least 10 characters long'
                        ]"
                  required
                  v-model="editEnrollment.motivation"
                  data-cy="motivationInput"
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
            @click="$emit('close-enrollment-dialog')"
        >
          Close
        </v-btn>
        <v-btn
            v-if="isValidMotivation(editEnrollment.motivation)"
            color="blue-darken-1"
            variant="text"
            @click="updateEnrollment"
            data-cy="saveEnrollment"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator';
import Activity from '@/models/activity/Activity';
import Enrollment from '@/models/enrollment/Enrollment';
import RemoteServices from '@/services/RemoteServices';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import { ISOtoString } from '@/services/ConvertDateService';

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
@Component({
  methods: { ISOtoString },
})
export default class EnrollmentDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: Enrollment, required: true }) readonly enrollment!: Enrollment;
  @Prop({ type: Activity, required: true }) readonly activity!: Activity;


  editEnrollment: Enrollment = new Enrollment();
  editActivity: Activity = new Activity();

  cypressCondition: boolean = false;

  async created() {
    this.editEnrollment = new Enrollment(this.enrollment);
    this.editActivity = new Activity(this.activity);
  }

  isNumberValid(value: any) {
    if (!/^\d+$/.test(value)) return false;
    const parsedValue = parseInt(value);
    return parsedValue >= 1 && parsedValue <= 5;
  }

  isValidMotivation(motivation: any) {
    return motivation && motivation.length >= 10;
  }


  isMotivation10CharactersLong(value: any): boolean {
    if (typeof value !== 'string') return false; // Check if the value is a string
    if (!/^\d+$/.test(value)) return false; // Check if the string contains only digits
    return value.length >= 10; // Check if the string length is at least 10
  }

  get canSave(): boolean {
    return (
        this.cypressCondition ||
        (!!this.editEnrollment.motivation)
    );
  }

  async updateEnrollment() {
    // TODO
    // if ((this.$refs.form as Vue & { validate: () => boolean }).validate() && this.editEnrollment.id !== null && this.editActivity.id !== null) {
    //   try {
    //     const result = await RemoteServices.registerEnrollment(
    //         this.$store.getters.getUser.id,
    //         this.editActivity.id,
    //         this.editEnrollment,
    //     )

    //     this.$emit('save-enrollment', result);
    //   } catch (error) {
    //     await this.$store.dispatch('error', error);
    //   }
    // }
  }
}
</script>

<style scoped lang="scss"></style>
