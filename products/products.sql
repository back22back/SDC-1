DROP table IF EXISTS products, styles, features, photos, skus, related;

create table products(
  id int not null primary key,
  name varchar,
  slogan varchar,
  description varchar,
  category varchar,
  default_price varchar
);

\copy products(id, name, slogan, description, category, default_price)
from '/Users/zongchenyang/HackReactor/AprilHR/week8/sdc/products/db/products.csv'
delimiter ','
csv header;

create table styles (
product_id int not null references products(id),
style_id int not null primary key,
name varchar,
sale_price varchar,
original_price varchar,
default_style int
);

\copy styles(style_id, product_id, name, sale_price, original_price, default_style)
from '/Users/zongchenyang/HackReactor/AprilHR/week8/sdc/products/db/styles.csv'
delimiter ','
csv header;

create table features (
feature_id int not null primary key,
product_id int not null references products(id),
feature varchar,
value varchar
);

\copy features(feature_id, product_id, feature, value)
from '/Users/zongchenyang/HackReactor/AprilHR/week8/sdc/products/db/features.csv'
delimiter ','
csv header;

create table photos (
photo_id int not null primary key,
style_id int not null references styles(style_id),
url varchar,
thumbnail_url varchar);

\copy photos(photo_id, style_id, url, thumbnail_url)
from '/Users/zongchenyang/HackReactor/AprilHR/week8/sdc/products/db/photos.csv'
delimiter ','
csv header;

create table skus (
skus_id int not null primary key,
style_id int not null references styles(style_id),
size varchar,
quantity int);

\copy photos(skus_id, style_id, size, quantity)
from '/Users/zongchenyang/HackReactor/AprilHR/week8/sdc/products/db/skus.csv'
delimiter ','
csv header;

create table related (
id int not null primary key,
product_id int not null references products(id),
related_id int);

\copy related(id, product_id, related_id)
from '/Users/zongchenyang/HackReactor/AprilHR/week8/sdc/products/db/related.csv'
delimiter ','
csv header;

create index idx_features_productId on features(product_id);
create index idx_related_productId on related(product_id);
create index idx_styles_productId on styles(product_id);
create index idx_photos_styleId on photos(style_id);
create index idx_skus_styleId on skus(style_id);
create index idx_skus_skusId on skus(skus_id);