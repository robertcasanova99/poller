interface StudentReducer {
    join: boolean,
    wrong: boolean,
    connected: boolean,
}

interface AdminReducer {
    id: number;
    show: boolean;
    open: boolean;
}
interface DeleteFabButton{
    data:Exam,
    dispatch:Function,
    setData:Function,
    chips:number[],
    setChips:Function,
    state:AdminReducer
}