import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 100,
  duration: '10s',
  // noConnectionReuse: true
};

export default function () {
  // for (var i = 0; i < 100; i++) {
    let res = http.get(`http://localhost:3000/products/8000`);
    check(res, {
      "is status 200": (r) => r.status === 200
    });
    // sleep(1);
  // }
}