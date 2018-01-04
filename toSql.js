  const pg = require('pg');
  const csv = require('fast-csv');

  const CONNECTION_STRING = 'postgres://localhost:5432/ipre';

  const client = new pg.Client(CONNECTION_STRING);

  client.connect();

  let ended = 0;
  let queries = 0;


  function end() {
    ended++;
    if (ended >= queries) {
      client.end();
      console.log('finished with ', ended, queries);
    }
  }

  function makeQuery(data) {
    const queryStr = `INSERT INTO results(f1, f2, image, result, descriptor) VALUES ('${data[0]}', '${data[1]}', ${data[2]}, ${data[3]}, 'lbp');`;
    const query = client.query(queryStr);
    query.on('end', () => {
      end();
    });
  }

  let first = true;
  csv
 .fromPath('../rank-2/results/acumulative_score_lbp.csv')
 .on('data', (data) => {
   if (first) {
     first = !first;
     return;
   }
   queries++;
   console.log(queries);
   makeQuery(data);
 })
 .on('end', () => {
   console.log('done reading');
 });
