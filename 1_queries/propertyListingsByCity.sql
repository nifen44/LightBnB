select p.id, p.title, p.cost_per_night, avg(pr.rating) as average_rating from properties p inner join propert
y_reviews pr on p.id = pr.property_id where city LIKE '%ancouve%' group by p.id having avg(pr.rating) >= 4 order by p.co
st_per_night limit 10;