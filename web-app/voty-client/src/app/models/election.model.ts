export class Election{
    electionId:string;
    name : string;
    country : string;
    year : string;      
    candidacy_startDate : Date | string;
    candidacy_endDate : Date | string;
    voting_startDate : Date | string;
    voting_endDate : Date | string;
    type : string;
}