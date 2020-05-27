export class Election{
    electionId:string;
    name : string;
    description : string;
    organisation : string; 
    votersNumber : number;     
    candidacy_startDate : Date | string;
    candidacy_endDate : Date | string;
    voting_startDate : Date | string;
    voting_endDate : Date | string;
    type : string;
    state : string;

}