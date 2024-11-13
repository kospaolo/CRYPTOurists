import { Article } from '../models/article.model';

export const ARTICLES: Article[] = [
  // Tourism Activities
  new Article(1, 'Guided Hiking Tour', '', 120),
  new Article(2, 'Snorkeling Adventure', '', 75),
  new Article(3, 'City Bike Rental', '', 15),
  new Article(4, 'Museum Pass', '', 40),
  new Article(5, 'Hot Air Balloon Ride', '', 200),
  new Article(6, 'Kayaking Experience', '', 60),
  new Article(7, 'Historical Walking Tour', '', 50),
  new Article(8, 'Surfing Lesson', '', 80),
  new Article(9, 'Paragliding', '', 250),
  new Article(10, 'Scuba Diving Session', '', 150),

  // Hotel Bookings
  new Article(11, 'Luxury Beach Resort', '', 350),
  new Article(12, 'Downtown City Hotel', '', 150),
  new Article(13, 'Mountain Lodge', '', 100),
  new Article(14, 'Boutique Hotel', '', 220),
  new Article(15, 'Eco-friendly Jungle Retreat', '', 180),
  new Article(16, 'Desert Oasis Resort', '', 400),
  new Article(17, 'Lakeside Cabin', '', 90),

  // Airplane Bookings
  new Article(18, 'Round-Trip Flight to Paris', '', 600),
  new Article(19, 'One-Way Flight to New York', '', 320),
  new Article(20, 'Round-Trip Flight to Tokyo', '', 900),
  new Article(21, 'Domestic Flight to Los Angeles', '', 150),
  new Article(22, 'International Flight to Berlin', '', 750),
  new Article(23, 'Economy Flight to Dubai', '', 500),
];
