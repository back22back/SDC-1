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
  try {
    const productsPromise = await db.any(`select * from products order by id offset ${page * count} rows fetch next ${count} rows only`);
    res.send(productsPromise);
  } catch (e) {
    console.log(e.stack);
    res.sendStatus(404);
  }
});

app.get('/products/:product_id', async (req, res) => {
  try {
    const productPromise = await db.any(`
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
    res.send(productPromise[0]);
  } catch (e) {
    console.log(e.stack);
    res.sendStatus(404);
  }
});

app.get('/products/:product_id/styles', async (req, res) => {
  try {
    const stylesPromise = await db.any(
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
    res.send(stylesPromise[0]);
  } catch (e) {
    console.log(e.stack);
    res.sendStatus(404);
  }
});

app.get('/products/:product_id/related', async (req, res) => {
  try {
    const relatedPromise = await db.any(`
    select array_agg (related_id) related
    from related
    where product_id = ${req.params.product_id}`);
    res.send(relatedPromise[0].related)
  } catch (e) {
    console.log(e.stack);
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})