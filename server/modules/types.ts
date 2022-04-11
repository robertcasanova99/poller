export interface Question{
    question:string,
    answers:string[],
    correct:string,
    choosen:string
}

export interface Exam{
    [key:string]:Question[]
}
