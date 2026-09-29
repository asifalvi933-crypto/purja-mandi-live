// src/constants/carData.js
// Dropdown and suggestion lists. Add a new brand/model/part here.

export const BRANDS = [
  "Maruti", "Hyundai", "Tata", "Mahindra", "Honda", "Toyota", "Ford",
  "Renault", "Kia", "Volkswagen", "Chevrolet", "Nissan", "Skoda", "Other",
];

export const MODEL_HINTS = {
  Maruti: ["Alto", "Alto 800", "WagonR", "Swift", "Dzire", "Baleno", "Ertiga", "Omni", "Eeco", "Celerio", "Ritz", "Zen"],
  Hyundai: ["i10", "Grand i10", "i20", "Santro", "Eon", "Creta", "Verna", "Xcent"],
  Tata: ["Indica", "Indigo", "Nano", "Tiago", "Nexon", "Safari", "Sumo"],
  Mahindra: ["Bolero", "Scorpio", "XUV500", "Thar", "Xylo"],
  Honda: ["City", "Amaze", "Jazz", "Civic", "Brio"],
  Toyota: ["Innova", "Etios", "Corolla", "Fortuner", "Liva"],
  Ford: ["Figo", "EcoSport", "Endeavour", "Fiesta"],
  Renault: ["Kwid", "Duster", "Pulse"],
  Kia: ["Seltos", "Sonet"],
  Volkswagen: ["Polo", "Vento"],
  Chevrolet: ["Beat", "Spark", "Cruze"],
  Nissan: ["Micra", "Sunny"],
  Skoda: ["Rapid", "Octavia"],
};

export const PART_HINTS = [
  "Headlight", "Tail light", "Front bumper", "Rear bumper", "Bonnet", "Door",
  "Side mirror", "Engine", "Gearbox", "Radiator", "AC compressor", "Alternator",
  "Self motor", "Clutch plate", "Shock absorber", "Steering rack", "Dashboard",
  "Seat", "Alloy wheel", "Battery", "Silencer", "Wiper motor", "Window glass",
];
