const express = require('express');
const morgan = require('morgan');
const db = require('../db/queries.js');
const PORT = 3000;

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/products', async (req, res) => {
  const page = req.query.page || 0;
  const count = req.query.count || 5;
  const client = await db.connect();
  const productsPromise = await db.query(`select * from products order by id offset ${page * count} rows fetch next ${count} rows only`);
  res.send(productsPromise.rows);
  client.release();
});

app.get('/products/:product_id', async (req, res) => {
  const client = await db.connect();
  let product;
  try {
    const productPromise = await client.query(`
    select
    *,
    coalesce(
      (
      select array_to_json(array_agg(row_to_json(x)))
      from(
        SELECT feature, value
              FROM features f
              WHERE p.id = f.product_id
      ) x
      ), '[]'
    ) as features
    from products p
    where id = ${req.params.product_id}`);
    product = productPromise.rows[0];
  } catch (e) {
    console.log(e.stack);
    res.sendStatus(404);
  } finally {
    res.send(product);
    client.release();
  }
});

app.get('/products/:product_id/styles', async (req, res) => {
  const client = await db.connect();
  let styles;
  try {
    const stylesPromise = await client.query(
    `select
    id as product_id,
    (select
    array_to_json(array_agg(row_to_json(results)))
    from(
        select
        style_id,
        name,
        original_price,
        sale_price,
        default_style,
        coalesce(
            (
            select array_to_json(array_agg(row_to_json(photo)))
            from(
            SELECT ph.thumbnail_url, ph.url
              FROM photos ph
              WHERE ph.style_id = s.style_id
            ) photo
          ), '[]'
        ) as photos,
        (
        select jsonb_object_agg(
        skus_id,
        (
        SELECT row_to_json(sku) FROM
          (
          SELECT quantity, size
          FROM skus innerSkus WHERE innerSkus.skus_id = skus.skus_id
          ) sku
        )
        )
        from skus skus where s.style_id = skus.style_id
        ) as skus

          from styles s
          where s.product_id = p.id
      ) results
    ) as results
    from products p
    where id = ${req.params.product_id}`);
    styles = stylesPromise.rows[0];
    res.send(styles);
  } catch (e) {
    console.log(e.stack);
  } finally {
    client.release();
  }
});

app.get('/products/:product_id/related', async (req, res) => {
  const client = await db.connect();
  let related;
  try {
    const relatedPromise = await client.query(`
    select array_agg (related_id) related
    from related
    where product_id = ${req.params.product_id}`);
    related = relatedPromise.rows[0].related;
  } catch (e) {
    console.log(e.stack);
    res.sendStatus(404);
  } finally {
    res.send(related);
    client.release();
  }
});

// app.get('/products/:product_id/related', async (req, res) => {
//   const client = db.connect((err, client, release) => {
//     if (err) {
//       return console.err(err.stack);
//     }
//     client.query(`
//     select array_agg (related_id) related
//     from related
//     where product_id = ${req.params.product_id}`, (err, result) => {
//       release();
//       if (err) {
//         return console.err(err.stack);
//       }
//       res.send(result.rows[0].related);
//     });
//   });
// });

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})