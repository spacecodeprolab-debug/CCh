// CCH menu data. Edit freely.
// Item: [name, price OR [[sizeLabel, price], ...], note, flags]  flags: v = veg, b = best seller, s = spicy
// Add "img/yourfile.jpg" as a 5th value to show a photo on that item.
const CONFIG = {
  whatsapp: "917778066638",           // main number (Mirzapur), used as a fallback if a branch has no number
  branches: [                          // wa = country code + number, no + or spaces
    {name: "Mirzapur", area: "Bhadra, Old City", addr: "3 Khona Bagicha, opp. Shital Ice Cream, near Faizan-e-Madina, Mirzapur, Bhadra, Ahmedabad 380001", wa: "917778066638"},
    {name: "Rakhiyal", area: "Rakhial", addr: "U/C, Falak Heights, Rakhial, Ahmedabad, Gujarat 380023", wa: "919601266638"},
    {name: "Sarkhej", area: "Gulzar Park", addr: "Gate No. 3, Amber Tower Rd, beside Rajdarbar Magic Chicken, Gulzar Park, Arshad Park, Sarkhej, Ahmedabad 380055", wa: "917202266638"},
    {name: "Danilimda", area: "Kabadi Market", addr: "Kabadi Market, near 4 Number, Danilimda, Ahmedabad 380028", wa: "919974466638"}
  ],
  owners: ["harun_s_m", "uzef_mansuri"],   // Instagram ids shown in the footer
  brand: "Chicken Craving Hub",
  addons: [["Extra cheese", 20], ["Extra mayo", 10]],
  instagram: "https://instagram.com/chicken_craving_hub"
};
const MENU = [
 ["Shawarma", "Rolled fresh, Khaboos or Rumali", [
  ["Regular Shawarma (Khaboos)", 70, "", "b"], ["Spicy Chicken Shawarma (Khaboos)", 100, "", "s"],
  ["Arabic Touch (Rumali)", 100], ["Cheesy Arabic (Rumali)", 120], ["Spicy Arabic (Rumali)", 120, "", "s"],
  ["Platter Shawarma", 150, "Shawarma with sides"]]],
 ["Burgers", "Our burger range", [
  ["Veg Patti Burger", 70, "", "v"], ["Veg Cheesy Burger", 90, "", "v"], ["Chicken Classic Burger", 100],
  ["Chicken Classic Cheese Burger", 120], ["Chicken Hot Tandoori Burger", 120, "", "s"],
  ["Chicken Cheesy Burger", 140, "", "b"], ["Chicken Zinger Burger", 130], ["Chicken Peri Zinger Burger", 140, "", "s"],
  ["Cheesy Zinger Burger", 150], ["Chicken Zinger Double Burger", 170], ["Cheesy Double Layer Burger", 180, "", "b"],
  ["Mega Cheesy Double Zinger", 200], ["No Bun Cheesy Burger", 120], ["Smoky Fish Cheese Burger", 130]]],
 ["Wraps", "Rolled in soft flatbread", [
  ["Classic Chicken Wrap", 100], ["Tandoori Chicken Wrap", 110], ["Peri Peri Chicken Wrap", 110, "", "s"],
  ["Tikka Chicken Wrap", 120], ["Barbeque Chicken Wrap", 130], ["Special Cheese Wrap", 140, "", "b"],
  ["Cheese Chicken Coin Wrap", 150]]],
 ["Pizza", "7 inch", [
  ["Classic Margarita", 100, "", "v"], ["Chicken Classic Pizza", 130], ["Chicken Tandoori Pizza", 140],
  ["Chicken Peri Pizza", 150, "", "s"], ["Chicken Barbeque Pizza", 150], ["Arabian Shawarma Pizza", 170, "", "b"]]],
 ["Fries", "Crisp and hot", [
  ["Salted Fries", [["Regular", 60], ["Large", 110]], "", "v"], ["Peri Peri Fries", [["Regular", 70], ["Large", 130]], "", "vs"],
  ["Fries with Chicken Mix", 160], ["Cheesy Baked Fries", [["Regular", 100], ["Large", 190]], "", "vb"]]],
 ["Tacos & Pockets", "Crunchy shells, hot fillings", [
  ["Classic Chicken Tacos", 80], ["Tandoori Chicken Tacos", 90], ["Peri Peri Chicken Tacos", 90, "", "s"],
  ["Barbeque Chicken Tacos", 90], ["Cheese Chicken Tacos", 100, "", "b"],
  ["Crunch Chicken Pockets", 100], ["Tandoori Crunch Pockets", 110], ["Crunch Zinger Pockets", 130]]],
 ["Chicken & Popcorn", "Broasted and fried", [
  ["Chicken Popcorn", [["Half · 15 pcs", 120], ["Full · 30 pcs", 200]], "", "b"], ["Momos Chicken Karkure · 5 pcs", 120],
  ["Fish Popcorn · 16 pcs", 140], ["Fish Finger · 6 pcs", 130], ["Spicy Hot Wings · 6 pcs", 140, "", "s"],
  ["3 Pcs Meal", 190, "1 drumstick, 1 thigh, 1 wing"], ["4 Pcs Meal", 220, "2 drumsticks, 2 thighs"]]],
 ["Baked Bowls", "Cheese baked, bubbling", [
  ["Chicken Popcorn Cheesy Baked", [["Half", 160], ["Full", 200]]], ["Tandoori Zinger + Fries Baked", [["Half", 150], ["Full", 220]]],
  ["Zinger Cheesy Baked", [["Half", 150], ["Full", 220]]], ["Zinger + Fries Baked", [["Half", 160], ["Full", 240]], "", "b"],
  ["Shawarma + Fries Cheesy Baked", [["Half", 150], ["Full", 270]]]]]
];
