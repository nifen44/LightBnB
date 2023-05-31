select r.id, p.title, p.cost_per_night, r.start_date, avg(pr.rating) as average_rating 
from reservations r 
inner join properties p on p.id = r.property_id 
inner join property_reviews pr on pr.reservation_id = r.id 
group by r.id, p.id 
order by r.start_date desc 
limit 10;