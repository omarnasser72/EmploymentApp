import "Qualifications";
class Job {
  id;
  postion;
  description;
  offer;
  maxCandidateNumber;
  qualifications = new Qualifications();

  constructor(
    id,
    postion,
    description,
    offer,
    maxCandidateNumber,
    qualifications
  ) {
    this.id = id;
    this.postion = postion;
    this.description = description;
    this.offer = offer;
    this.maxCandidateNumber = maxCandidateNumber;
    this.qualifications = qualifications;
  }
}
