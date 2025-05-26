export interface Floors{
    id: string | number,
    floor_number: number,
    name: string,
    createdAt: string,
    updatedAt: string
}

export interface Rooms{
    id: string | number,
    room_number: number,
    floor_id: string | number,
    description: string,
    status: string,
    createdAt: string,
    updatedAt: string
}