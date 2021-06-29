import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 10,
  duration: '10s',
  // noConnectionReuse: true
};

export default function () {
  let rand = Math.floor(Math.random() * 1000000);
  let res = http.get(`http://localhost:3000/products/${rand}`);
  check(res, {
    "is status 200": (r) => r.status === 200
  });
    // sleep(1);
}