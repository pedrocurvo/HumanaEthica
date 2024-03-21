package pt.ulisboa.tecnico.socialsoftware.humanaethica.enrollment.dto;

import pt.ulisboa.tecnico.socialsoftware.humanaethica.enrollment.domain.Enrollment;
import pt.ulisboa.tecnico.socialsoftware.humanaethica.utils.DateHandler;

public class EnrollmentDto {
    private Integer id;
    private String motivation;

    private String enrollmentDateTime;

    private Integer volunteerId;

    private String volunteerName;

    private Boolean participating;


    public EnrollmentDto() {}

    public EnrollmentDto(Enrollment enrollment) {
        this.id = enrollment.getId();
        this.motivation = enrollment.getMotivation();
        this.enrollmentDateTime = DateHandler.toISOString(enrollment.getEnrollmentDateTime());
        this.volunteerId = enrollment.getVolunteer().getId();
        this.volunteerName = enrollment.getVolunteer().getName();
        this.participating = enrollment.isParticipating();
        System.out.println("this.participating: " + this.participating);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMotivation() {
        return motivation;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }

    public String getEnrollmentDateTime() {
        return enrollmentDateTime;
    }

    public void setEnrollmentDateTime(String enrollmentDateTime) {
        this.enrollmentDateTime = enrollmentDateTime;
    }

    public Integer getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteer(Integer volunteerId) {
        this.volunteerId = volunteerId;
    }

    public String getVolunteerName() {
        return volunteerName;
    }

    public void setVolunteerName(String volunteerName) {
        this.volunteerName = volunteerName;
    }

    public Boolean getParticipating() {
        return participating;
    }

    public void setParticipating(Boolean participating) {
        this.participating = participating;
    }

}
