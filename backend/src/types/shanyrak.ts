export interface Shanyrak {
    id: string;
    name: string;
    points: number;
    members: number;
    color: string;
}

export interface CreateShanyrakDto {
    name: string;
    color: string;
}

export interface AddPointsDto {
    points: number;
}

export interface UpdateMembersDto {
    delta: number;
}