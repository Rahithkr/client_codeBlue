import { baseUrl } from '@/utils/baseUrl';
import { io } from 'socket.io-client';

const socket = io(`${baseUrl}`, {
  withCredentials: true,
});





export  default socket;


