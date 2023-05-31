select city, count(r.id) as total_reservations from properties p inner join reservations r on p.id = r.proper
ty_id group by city order by sum(r.id) desc;