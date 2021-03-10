import axios from 'axios';
import { APIRootPath } from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
    show: boolean;
}

export type ApiClient = {
    getTickets: (search: String, page: number, orderBy: string) => Promise<Ticket[]>;

}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (search: String, page: number, orderBy: string) => {
            return axios.get(APIRootPath + '/' + search, { params: { page: page, orderBy: orderBy } }).then((res) => res.data);
        }
    }
}
