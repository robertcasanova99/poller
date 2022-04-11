interface Question{
    question:string,
    answers:string[],
    correct:string,
    choosen:string
}

interface Exam{
    [key:string]:Question[]
}
