import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const db = createClient({
  url: process.env?.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env?.TURSO_AUTH_TOKEN || undefined,
});

const ADMIN_EMAIL = process.env?.ADMIN_EMAIL || "admin@adventureholidaydestination.com";
const ADMIN_PASSWORD = process.env?.ADMIN_PASSWORD || "Admin@12345";

const domesticPackages = [
  { uid:"d1", title:"Kashmir Paradise", type:"domestic", region:"North India", price:"₹15,000", origPrice:"₹22,000", duration:"5N / 6D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:128, description:"Explore the paradise on earth with snow-capped mountains, serene lakes, and Mughal gardens. From Dal Lake shikara rides to Gulmarg gondola, experience Kashmir like never before.", highlights:["Dal Lake Shikara Ride","Mughal Gardens Visit","Gulmarg Gondola Ride","Pahalgam Valley Tour"], inclusions:["Hotel + 1 Night Houseboat","Breakfast & Dinner","Private Cab Sightseeing","Airport Transfers"], exclusions:["Flight/Train fare","Personal expenses","Optional activities","Tips and gratuities"], itinerary:[{day:"Day 1",desc:"Arrival in Srinagar. Airport pickup, Dal Lake Shikara ride & Mughal Gardens."},{day:"Day 2",desc:"Srinagar to Sonmarg. Glacier views & river sightseeing."},{day:"Day 3",desc:"Srinagar to Gulmarg. Snow activities & Gondola ride (optional)."},{day:"Day 4",desc:"Srinagar to Pahalgam. Betaab Valley & Aru Valley visit."},{day:"Day 5",desc:"Dal Lake Houseboat stay. Local market explorations."},{day:"Day 6",desc:"Departure."}], howToReach:"Fly to Srinagar Airport (SXR) — direct flights from Delhi, Mumbai, and other major cities.", thingsToCarry:"Warm clothes, sunscreen, comfortable walking shoes, camera, valid ID proof.", importantInfo:"Valid ID proof required for all travellers.", eligibility:"Open to all ages.", location:"Srinagar, Kashmir", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d2", title:"Himachal Adventure", type:"domestic", region:"North India", price:"₹12,000", origPrice:"₹18,000", duration:"4N / 5D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:96, description:"Experience the best of Himachal Pradesh — from the colonial charm of Shimla to the adventure-filled Solang Valley.", highlights:["Shimla Mall Road","Kufri Snow Activities","Solang Valley Adventure","Atal Tunnel Drive"], inclusions:["3-Star Hotel Stay","Breakfast & Dinner","Private Cab","Toll & Parking"], exclusions:["Flight/Train fare","Personal expenses"], itinerary:[{day:"Day 1",desc:"Delhi/Chandigarh to Shimla. Mall Road visit."},{day:"Day 2",desc:"Shimla local: Kufri & Jakhu Temple."},{day:"Day 3",desc:"Shimla to Manali. Enroute views."},{day:"Day 4",desc:"Manali: Solang Valley & Atal Tunnel."},{day:"Day 5",desc:"Return journey to Delhi."}], howToReach:"Fly to Chandigarh Airport (IXC) or take a train to Chandigarh.", thingsToCarry:"Warm layers, sunscreen, comfortable shoes.", importantInfo:"Road conditions may vary in winter.", eligibility:"Open to all ages.", location:"Shimla & Manali, Himachal Pradesh", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d3", title:"Uttarakhand Trails", type:"domestic", region:"North India", price:"₹14,000", origPrice:"₹20,000", duration:"5N / 6D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", rating:4.7, reviews:74, description:"From the sacred ghats of Haridwar to the serene lakes of Nainital — spirituality and nature in harmony.", highlights:["Ganga Aarti Haridwar","Mussoorie Lake View","Nainital Boating","Valley of Flowers Trek"], inclusions:["Hotel Accommodation","Breakfast & Dinner","Private Cab"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Delhi to Haridwar. Evening Ganga Aarti."},{day:"Day 2",desc:"Haridwar to Mussoorie."},{day:"Day 3",desc:"Mussoorie: Kempty Falls & Mall Road."},{day:"Day 4",desc:"Mussoorie to Nainital."},{day:"Day 5",desc:"Nainital: Naini Lake boating & Snow View Point."},{day:"Day 6",desc:"Return to Delhi."}], howToReach:"Fly to Dehradun Airport (DED) or take a train to Haridwar.", thingsToCarry:"Comfortable walking shoes, light jacket, sunscreen.", importantInfo:"Weather can change quickly in hill stations.", eligibility:"Open to all ages.", location:"Haridwar, Mussoorie, Nainital, Uttarakhand", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d4", title:"Ladakh Expedition", type:"domestic", region:"North India", price:"₹22,000", origPrice:"₹30,000", duration:"5N / 6D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1626028320532-3a0a96b3de12?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:67, description:"Ride through the highest motorable passes, camp by Pangong Lake, and explore rugged Ladakh.", highlights:["Khardung La Pass","Pangong Lake Camping","Nubra Valley","Leh Palace"], inclusions:["Hotel / Luxury Camp Stay","Breakfast & Dinner","Inner Line Permits","Private Cab"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrival in Leh. Day for acclimatization."},{day:"Day 2",desc:"Leh Sightseeing: Shanti Stupa & Leh Palace."},{day:"Day 3",desc:"Leh to Nubra via Khardung La Pass."},{day:"Day 4",desc:"Nubra to Pangong Lake."},{day:"Day 5",desc:"Pangong to Leh."},{day:"Day 6",desc:"Departure."}], howToReach:"Fly to Kushok Bakula Rimpochee Airport (IXL) in Leh.", thingsToCarry:"Heavy woolens, sunscreen SPF50+, valid ID.", importantInfo:"Acclimatization is essential.", eligibility:"Age 12+. Not recommended for heart/respiratory conditions.", location:"Leh, Nubra Valley, Pangong Lake, Ladakh", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d5", title:"Rajasthan Royal", type:"domestic", region:"West India", price:"₹16,000", origPrice:"₹22,000", duration:"6N / 7D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1595435742616-8f8b4133f92c?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:112, description:"Live like royalty in the land of kings. Majestic forts, desert camps, and lake palaces.", highlights:["Amber Fort Jaipur","Jaisalmer Desert Safari","Udaipur Lake Pichola","Jodhpur Blue City"], inclusions:["Heritage Hotels","Breakfast & Dinner","Private Driver","Desert Safari"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Jaipur Arrival. City Palace & Hawa Mahal."},{day:"Day 2",desc:"Amber Fort & Nahargarh Sunset."},{day:"Day 3",desc:"Jaipur to Jodhpur. Mehrangarh Fort."},{day:"Day 4",desc:"Jodhpur to Jaisalmer. Desert Camp."},{day:"Day 5",desc:"Jaisalmer: Patwon Ki Haveli & Sam Dunes."},{day:"Day 6",desc:"Jaisalmer to Udaipur. Pichola Boat Ride."},{day:"Day 7",desc:"Udaipur sightseeing & Departure."}], howToReach:"Fly to Jaipur Airport (JAI).", thingsToCarry:"Light cotton clothes, sunscreen, hat.", importantInfo:"Desert safari involves bumpy rides.", eligibility:"Open to all ages.", location:"Jaipur, Jodhpur, Jaisalmer, Udaipur, Rajasthan", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d6", title:"Goa Beach Vibes", type:"domestic", region:"West India", price:"₹9,000", origPrice:"₹15,000", duration:"3N / 4D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80", rating:4.7, reviews:154, description:"Sun, sand, and endless fun. Vibrant beaches, waterfalls, and Portuguese heritage.", highlights:["North Goa Beaches","Dudhsagar Waterfalls","Spice Plantation Tour","Sunset Cruise"], inclusions:["Beach Resort with Pool","Daily Breakfast","Private Local Cab"], exclusions:["Flights","Lunch & Dinner"], itinerary:[{day:"Day 1",desc:"Arrival & Beach Relaxation."},{day:"Day 2",desc:"North Goa: Baga, Calangute, Aguada."},{day:"Day 3",desc:"South Goa: Colva & Dudhsagar Falls."},{day:"Day 4",desc:"Departure."}], howToReach:"Fly to Goa Airport (GOI).", thingsToCarry:"Swimwear, sunscreen, flip flops.", importantInfo:"Water sports subject to weather.", eligibility:"Open to all ages.", location:"North & South Goa", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d7", title:"Andaman Escape", type:"domestic", region:"South India", price:"₹28,000", origPrice:"₹38,000", duration:"4N / 5D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1537956965359-7575183d1f57?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:89, description:"Crystal clear waters, pristine beaches, and underwater adventures.", highlights:["Radhanagar Beach","Scuba Diving Experience","Cellular Jail Light Show","Elephant Beach"], inclusions:["3-Star Hotel Stay","Daily Breakfast","Ferry Transfers","Snorkeling Activity"], exclusions:["Flights","Scuba diving"], itinerary:[{day:"Day 1",desc:"Arrival Port Blair. Cellular Jail & Corbyn's Cove."},{day:"Day 2",desc:"Port Blair to Havelock. Radhanagar Beach."},{day:"Day 3",desc:"Havelock: Elephant Beach & water sports."},{day:"Day 4",desc:"Return to Port Blair. Shopping & local tours."},{day:"Day 5",desc:"Airport Drop."}], howToReach:"Fly to Veer Savarkar Airport (IXZ) in Port Blair.", thingsToCarry:"Swimwear, reef-safe sunscreen, waterproof bag.", importantInfo:"Ferry timings subject to change.", eligibility:"Open to all ages.", location:"Port Blair, Havelock Island, Andaman", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d8", title:"Kerala God's Own", type:"domestic", region:"South India", price:"₹20,000", origPrice:"₹30,000", duration:"5N / 6D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:176, description:"Float through backwaters on a luxury houseboat, stroll through misty tea gardens.", highlights:["Alleppey Houseboat","Munnar Tea Gardens","Kathakali Show","Periyar Wildlife"], inclusions:["Houseboat Stay","Resort in Munnar","All Meals on Houseboat"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrival Kochi. Fort Kochi & Chinese Fishing Nets."},{day:"Day 2",desc:"Kochi to Munnar. Tea plantation visit."},{day:"Day 3",desc:"Munnar: Eravikulam & Tea Museum."},{day:"Day 4",desc:"Munnar to Thekkady. Periyar Boat Ride."},{day:"Day 5",desc:"Thekkady to Alleppey. Overnight Houseboat."},{day:"Day 6",desc:"Departure from Kochi."}], howToReach:"Fly to Cochin Airport (COK).", thingsToCarry:"Light cotton clothes, umbrella, insect repellent.", importantInfo:"Houseboat check-in at 12 noon.", eligibility:"Open to all ages.", location:"Kochi, Munnar, Thekkady, Alleppey, Kerala", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d9", title:"Golden Triangle", type:"domestic", region:"North India", price:"₹13,000", origPrice:"₹19,000", duration:"4N / 5D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:201, description:"India's most iconic circuit — Taj Mahal at sunrise, Jaipur's pink city, Delhi's monuments.", highlights:["Taj Mahal Sunrise","Amber Fort Jaipur","Qutub Minar Delhi","Local Bazaar Shopping"], inclusions:["3-Star Hotels","Daily Breakfast","AC Transport","Monument Entries"], exclusions:["Flights","Lunch & Dinner"], itinerary:[{day:"Day 1",desc:"Delhi Arrival. Qutub Minar & India Gate."},{day:"Day 2",desc:"Delhi: Red Fort, Chandni Chowk, Lotus Temple."},{day:"Day 3",desc:"Delhi to Agra. Taj Mahal sunset."},{day:"Day 4",desc:"Agra to Jaipur via Fatehpur Sikri."},{day:"Day 5",desc:"Jaipur: Amber Fort & Departure."}], howToReach:"Fly to Delhi Airport (DEL).", thingsToCarry:"Comfortable shoes, sunscreen, hat.", importantInfo:"Taj Mahal closed on Fridays.", eligibility:"Open to all ages.", location:"Delhi, Agra, Jaipur", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d10", title:"Jim Corbett Safari", type:"domestic", region:"North India", price:"₹19,000", origPrice:"₹26,000", duration:"2N / 3D", guests:"2", tag:"Wildlife", img:"https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:167, description:"India's oldest national park — spot tigers, elephants, and exotic birds.", highlights:["Jeep Safari in Corbett","River Resort Stay","Naturalist Guide","Wildlife Photography"], inclusions:["Riverside Resort","All Meals","Jeep Safari","Naturalist Guide"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrive Corbett. Check-in resort. Evening nature walk."},{day:"Day 2",desc:"Morning jeep safari. Afternoon bird watching."},{day:"Day 3",desc:"Morning safari or river rafting. Departure."}], howToReach:"Fly to Pantnagar Airport (PGH).", thingsToCarry:"Neutral-colored clothing, binoculars, sunscreen.", importantInfo:"Safari zones allocated by forest department.", eligibility:"Open to all ages.", location:"Jim Corbett National Park, Uttarakhand", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d11", title:"Ranthambore Tigers", type:"domestic", region:"North India", price:"₹24,000", origPrice:"₹32,000", duration:"3N / 4D", guests:"2", tag:"Wildlife", img:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:89, description:"India's most famous tiger reserve. Royal Bengal Tigers in their natural habitat.", highlights:["Canter & Jeep Safari","Ranthambore Fort","Lakeside Tiger Spotting","Heritage Hotel Stay"], inclusions:["Heritage Hotel","Breakfast & Dinner","Safari Permits"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrive Sawai Madhopur. Ranthambore Fort visit."},{day:"Day 2",desc:"Full day jeep safari."},{day:"Day 3",desc:"Morning canter safari. Afternoon village tour."},{day:"Day 4",desc:"Morning nature walk & Departure."}], howToReach:"Fly to Jaipur Airport (JAI).", thingsToCarry:"Neutral-colored clothing, binoculars.", importantInfo:"Tiger sighting not guaranteed.", eligibility:"Open to all ages.", location:"Ranthambore National Park, Rajasthan", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d12", title:"Manali Family Trip", type:"domestic", region:"North India", price:"₹18,000", origPrice:"₹26,000", duration:"4N / 5D", guests:"Family", tag:"Hill Station", img:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:134, description:"A perfect family getaway. Snow activities, mountain views, and cozy cafe walks.", highlights:["Solang Valley Snow Activities","Atal Tunnel Drive","Old Manali Cafe Walk","Rohtang Pass Views"], inclusions:["Mountain View Hotel","Breakfast & Dinner","Private Cab"], exclusions:["Flights","Snow activity charges"], itinerary:[{day:"Day 1",desc:"Delhi/Chandigarh to Manali. Mall Road."},{day:"Day 2",desc:"Solang Valley: paragliding, snow activities."},{day:"Day 3",desc:"Atal Tunnel & Sissu."},{day:"Day 4",desc:"Old Manali, Hadimba Temple."},{day:"Day 5",desc:"Return journey to Delhi."}], howToReach:"Fly to Bhuntar Airport (KUU).", thingsToCarry:"Warm clothes, sunscreen, comfortable shoes.", importantInfo:"Rohtang Pass requires separate permit.", eligibility:"Open to all ages.", location:"Manali, Himachal Pradesh", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d13", title:"Shimla Nainital", type:"domestic", region:"North India", price:"₹16,000", origPrice:"₹22,000", duration:"5N / 6D", guests:"2", tag:"Hill Station", img:"https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80", rating:4.7, reviews:98, description:"Two beloved hill stations in one trip — colonial charm meets lake views.", highlights:["Shimla Mall Road","Kufri Snow Point","Nainital Lake Boating","Snow View Point"], inclusions:["Hotel Stay","Daily Breakfast","Private Cab"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Delhi to Shimla. Evening Mall Road."},{day:"Day 2",desc:"Shimla: Kufri & Jakhu Temple."},{day:"Day 3",desc:"Shimla to Nainital."},{day:"Day 4",desc:"Nainital: Lake boating, Snow View."},{day:"Day 5",desc:"Nainital: Bhimtal & Sattal."},{day:"Day 6",desc:"Return to Delhi."}], howToReach:"Fly to Chandigarh (IXC) for Shimla.", thingsToCarry:"Warm clothes, comfortable shoes.", importantInfo:"Road conditions may vary.", eligibility:"Open to all ages.", location:"Shimla & Nainital", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d14", title:"Sikkim Darjeeling", type:"domestic", region:"East India", price:"₹22,000", origPrice:"₹30,000", duration:"6N / 7D", guests:"2", tag:"Hill Station", img:"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:67, description:"Kanchenjunga sunrise at Tiger Hill, toy train, pristine monasteries and lakes.", highlights:["Tiger Hill Sunrise","Batasia Loop","Gurudongmar Lake","Tea Garden Tour"], inclusions:["Hotel Stay","Breakfast & Dinner","Permits Included"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrive Bagdogra. Transfer to Darjeeling."},{day:"Day 2",desc:"Tiger Hill sunrise & Batasia Loop."},{day:"Day 3",desc:"Darjeeling: Tea gardens & toy train."},{day:"Day 4",desc:"Transfer to Gangtok."},{day:"Day 5",desc:"Gangtok: Tsomgo Lake & Baba Mandir."},{day:"Day 6",desc:"Nathula Pass (subject to permit)."},{day:"Day 7",desc:"Return to Bagdogra & Departure."}], howToReach:"Fly to Bagdogra Airport (IXB).", thingsToCarry:"Warm layers, comfortable shoes, camera.", importantInfo:"Nathula Pass requires special permit.", eligibility:"Open to all ages.", location:"Darjeeling & Gangtok", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d15", title:"Kerala Honeymoon", type:"domestic", region:"South India", price:"₹32,000", origPrice:"₹42,000", duration:"5N / 6D", guests:"Couple", tag:"Honeymoon", img:"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:203, description:"The ultimate romantic escape — luxury houseboat, candlelit dinners, Ayurvedic spa.", highlights:["Luxury Houseboat Stay","Munnar Tea Gardens","Candlelight Dinner","Couple Spa"], inclusions:["Luxury Houseboat","Honeymoon Suite","Candle Dinner","Couple Spa"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrive Kochi. Transfer to Munnar."},{day:"Day 2",desc:"Munnar: Tea factory, Eravikulam."},{day:"Day 3",desc:"Munnar to Thekkady. Spice tour."},{day:"Day 4",desc:"Thekkady to Alleppey. Luxury houseboat."},{day:"Day 5",desc:"Houseboat to Kumarakom. Couple spa."},{day:"Day 6",desc:"Departure from Kochi."}], howToReach:"Fly to Cochin Airport (COK).", thingsToCarry:"Light cotton clothes, camera.", importantInfo:"Candle dinner weather permitting.", eligibility:"Couples only.", location:"Kerala", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d16", title:"Shimla Manali Honeymoon", type:"domestic", region:"North India", price:"₹24,000", origPrice:"₹34,000", duration:"5N / 6D", guests:"Couple", tag:"Honeymoon", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:156, description:"A dreamy honeymoon through snow-capped mountains.", highlights:["Snow Activities","Valley View Dinner","River Rafting","Bonfire Night"], inclusions:["Valley View Hotel","Breakfast & Dinner","Special Decoration"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrive Shimla. Mall Road romantic walk."},{day:"Day 2",desc:"Shimla: Kufri, snow activities."},{day:"Day 3",desc:"Shimla to Manali."},{day:"Day 4",desc:"Manali: Solang Valley, river rafting."},{day:"Day 5",desc:"Old Manali, Hadimba Temple, bonfire."},{day:"Day 6",desc:"Return journey."}], howToReach:"Fly to Chandigarh (IXC).", thingsToCarry:"Warm clothes, comfortable shoes.", importantInfo:"Special room decoration on request.", eligibility:"Couples only.", location:"Shimla & Manali", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d17", title:"Andaman Honeymoon", type:"domestic", region:"South India", price:"₹38,000", origPrice:"₹50,000", duration:"5N / 6D", guests:"Couple", tag:"Honeymoon", img:"https://images.unsplash.com/photo-1537956965359-7575183d1f57?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:78, description:"Turquoise waters, white sand beaches, and private island experiences.", highlights:["Private Beach Dinner","Scuba Diving Couple","Island Hopping","Sunset Kayaking"], inclusions:["Beach Resort","All Meals","Scuba Diving"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrive Port Blair. Cellular Jail & beach."},{day:"Day 2",desc:"Port Blair to Havelock. Radhanagar Beach."},{day:"Day 3",desc:"Elephant Beach: scuba diving."},{day:"Day 4",desc:"Havelock to Neil Island."},{day:"Day 5",desc:"Return Port Blair. Private beach dinner."},{day:"Day 6",desc:"Departure."}], howToReach:"Fly to Port Blair (IXZ).", thingsToCarry:"Swimwear, reef-safe sunscreen.", importantInfo:"Private beach dinner requires advance booking.", eligibility:"Couples only.", location:"Port Blair, Havelock, Neil Island, Andaman", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d18", title:"Goa Beach Holiday", type:"domestic", region:"West India", price:"₹12,000", origPrice:"₹18,000", duration:"3N / 4D", guests:"2", tag:"Beach", img:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80", rating:4.7, reviews:189, description:"Sun-kissed beaches, vibrant nightlife, and Portuguese heritage.", highlights:["North & South Goa","Water Sports","Sunset Cruise","Spice Plantation"], inclusions:["Beach Resort","Daily Breakfast","Water Sports"], exclusions:["Flights","Lunch & Dinner"], itinerary:[{day:"Day 1",desc:"Arrive Goa. Beach relaxation."},{day:"Day 2",desc:"North Goa: Baga, Calangute, Aguada."},{day:"Day 3",desc:"South Goa: Colva, Dudhsagar Falls."},{day:"Day 4",desc:"Spice plantation & Departure."}], howToReach:"Fly to Goa Airport (GOI).", thingsToCarry:"Swimwear, sunscreen.", importantInfo:"Water sports subject to weather.", eligibility:"Open to all ages.", location:"North & South Goa", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d19", title:"Kerala Backwaters", type:"domestic", region:"South India", price:"₹18,000", origPrice:"₹25,000", duration:"4N / 5D", guests:"2", tag:"Beach", img:"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:112, description:"Cruise through backwaters on a traditional houseboat and relax at Kovalam beach.", highlights:["Houseboat Overnight","Alleppey Backwaters","Kovalam Beach","Fishing Village Visit"], inclusions:["Houseboat Stay","Beach Resort","All Meals on Boat"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrive Kochi. Fort Kochi sightseeing."},{day:"Day 2",desc:"Kochi to Alleppey. Board houseboat."},{day:"Day 3",desc:"Houseboat cruise. Transfer to Kovalam."},{day:"Day 4",desc:"Kovalam beach day & Ayurvedic massage."},{day:"Day 5",desc:"Departure from Trivandrum."}], howToReach:"Fly to Cochin (COK) or Trivandrum (TRV).", thingsToCarry:"Light cotton clothes, sunscreen.", importantInfo:"Ayurvedic massage by appointment.", eligibility:"Open to all ages.", location:"Kochi, Alleppey, Kovalam, Kerala", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d20", title:"Bhutan Happiness", type:"domestic", region:"Near India", price:"₹38,000", origPrice:"₹50,000", duration:"5N / 6D", guests:"2", tag:"Near India", img:"https://images.unsplash.com/photo-1553856622-d1b350888439?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:67, description:"Land of the Thunder Dragon — ancient monasteries, stunning valleys.", highlights:["Tiger's Nest Monastery","Punakha Dzong","Thimphu Buddha Point","Paro Valley"], inclusions:["Accommodation","All Meals","Private Driver"], exclusions:["Flights","Visa fees"], itinerary:[{day:"Day 1",desc:"Paro Arrival. Transfer to Thimphu."},{day:"Day 2",desc:"Thimphu: Buddha Point, Memorial Chorten."},{day:"Day 3",desc:"Thimphu to Punakha. Punakha Dzong."},{day:"Day 4",desc:"Punakha to Paro."},{day:"Day 5",desc:"Tiger's Nest Monastery hike."},{day:"Day 6",desc:"Departure."}], howToReach:"Fly to Paro Airport (PBH).", thingsToCarry:"Hiking shoes, warm layers, valid passport.", importantInfo:"Bhutan requires a visa. SDF applies.", eligibility:"Open to all ages. Valid passport required.", location:"Thimphu, Punakha, Paro, Bhutan", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d21", title:"Nepal Himalayas", type:"domestic", region:"Near India", price:"₹20,000", origPrice:"₹28,000", duration:"4N / 5D", guests:"2", tag:"Near India", img:"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", rating:4.7, reviews:89, description:"Ancient temples in Kathmandu to serene lakeside of Pokhara.", highlights:["Kathmandu Heritage","Pokhara Lakeside","Nagarkot Sunrise","Pashupatinath Temple"], inclusions:["Hotels with View","Breakfast & Dinner","Private Transport"], exclusions:["Flights","Visa fees"], itinerary:[{day:"Day 1",desc:"Arrive Kathmandu. City tour."},{day:"Day 2",desc:"Kathmandu: Pashupatinath, Boudhanath."},{day:"Day 3",desc:"Fly/drive to Pokhara."},{day:"Day 4",desc:"Pokhara: Sarangkot sunrise, Davis Falls."},{day:"Day 5",desc:"Return Kathmandu & Departure."}], howToReach:"Fly to Tribhuvan Airport (KTM).", thingsToCarry:"Comfortable shoes, light layers, valid passport.", importantInfo:"Nepal visa on arrival available.", eligibility:"Open to all ages. Valid passport required.", location:"Kathmandu & Pokhara, Nepal", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d22", title:"Sri Lanka Explorer", type:"domestic", region:"Near India", price:"₹30,000", origPrice:"₹42,000", duration:"5N / 6D", guests:"2", tag:"Near India", img:"https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:78, description:"Pearl of the Indian Ocean — rock fortresses, tea plantations, pristine beaches.", highlights:["Sigiriya Rock Fortress","Kandy Temple","Nuwara Eliya Tea Gardens","Galle Fort"], inclusions:["3/4-Star Hotels","Daily Breakfast","Tour Guide"], exclusions:["Flights","Visa fees"], itinerary:[{day:"Day 1",desc:"Colombo Arrival."},{day:"Day 2",desc:"Colombo to Sigiriya. Rock Fortress."},{day:"Day 3",desc:"Sigiriya to Kandy."},{day:"Day 4",desc:"Kandy to Nuwara Eliya. Tea gardens."},{day:"Day 5",desc:"Nuwara Eliya to Colombo. Galle Fort."},{day:"Day 6",desc:"Departure."}], howToReach:"Fly to Bandaranaike Airport (CMB).", thingsToCarry:"Light clothes, sunscreen, valid passport.", importantInfo:"Sri Lanka ETA required.", eligibility:"Open to all ages. Valid passport required.", location:"Colombo, Sigiriya, Kandy, Sri Lanka", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d23", title:"Assam & Meghalaya", type:"domestic", region:"East India", price:"₹18,000", origPrice:"₹25,000", duration:"5N / 6D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:52, description:"Kaziranga's rhinos to Meghalaya's living root bridges and crystal-clear rivers.", highlights:["Kaziranga Safari","Living Root Bridges","Dawki Crystal River","Mawlynnong Village"], inclusions:["Hotel Stay","Breakfast & Dinner","Safari Permits"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Guwahati Arrival. Kamakhya Temple."},{day:"Day 2",desc:"Guwahati to Kaziranga."},{day:"Day 3",desc:"Kaziranga Jeep Safari."},{day:"Day 4",desc:"Transfer to Shillong. Umiam Lake."},{day:"Day 5",desc:"Cherrapunji: Seven Sisters Falls."},{day:"Day 6",desc:"Dawki & Mawlynnong. Departure."}], howToReach:"Fly to Guwahati Airport (GAU).", thingsToCarry:"Comfortable shoes, rain gear, insect repellent.", importantInfo:"Inner Line Permit needed for certain areas.", eligibility:"Open to all ages.", location:"Guwahati, Kaziranga, Shillong, Northeast India", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d24", title:"Gujarat & Rann", type:"domestic", region:"West India", price:"₹15,000", origPrice:"₹22,000", duration:"4N / 5D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1595435742616-8f8b4133f92c?auto=format&fit=crop&w=800&q=80", rating:4.7, reviews:45, description:"Magical white desert, Asiatic lions at Gir, India's cultural heritage.", highlights:["White Rann of Kutch","Gir National Park","Somnath Temple","Statue of Unity"], inclusions:["Heritage Hotel","Breakfast & Dinner","Safari Permits"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Ahmedabad Arrival. Sabarmati Ashram."},{day:"Day 2",desc:"Ahmedabad to Bhuj. White Rann."},{day:"Day 3",desc:"Rann Utsav & village tour."},{day:"Day 4",desc:"Gir National Park Safari."},{day:"Day 5",desc:"Somnath Temple & Departure."}], howToReach:"Fly to Ahmedabad Airport (AMD).", thingsToCarry:"Light cotton clothes, sunscreen.", importantInfo:"White Rann best during Rann Utsav (Nov-Feb).", eligibility:"Open to all ages.", location:"Ahmedabad, Bhuj, Gir, Somnath, Gujarat", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"d25", title:"Lakshadweep Escape", type:"domestic", region:"South India", price:"₹35,000", origPrice:"₹48,000", duration:"4N / 5D", guests:"2", tag:"Domestic", img:"https://images.unsplash.com/photo-1537956965359-7575183d1f57?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:34, description:"India's hidden gem — turquoise lagoons, pristine coral reefs.", highlights:["Bangaram Island","Snorkeling & Kayaking","Lagoon Activities","Pristine Beaches"], inclusions:["Resort Stay","All Meals","Island Sightseeing"], exclusions:["Flights","Water sports"], itinerary:[{day:"Day 1",desc:"Arrive Agatti Island."},{day:"Day 2",desc:"Lagoon activities."},{day:"Day 3",desc:"Full day Bangaram Island."},{day:"Day 4",desc:"Beach relaxation & water sports."},{day:"Day 5",desc:"Departure."}], howToReach:"Fly to Agatti Airport (AGX).", thingsToCarry:"Swimwear, reef-safe sunscreen, ID proof.", importantInfo:"Entry permit required. Limited flights.", eligibility:"Open to all ages.", location:"Agatti Island, Lakshadweep", cancellation:"Full refund if cancelled 15+ days before departure." }
];

const spiritualPackages = [
  { uid:"sp1", title:"Ayodhya Ram Mandir", type:"spiritual", region:"North India", price:"₹8,000", origPrice:"₹14,000", duration:"2N / 3D", guests:"2", tag:"Temple", img:"https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:145, description:"Seek blessings at the grand Ram Mandir and witness the mesmerizing Saryu Aarti.", highlights:["Ram Janmabhoomi Darshan","Hanuman Garhi Visit","Saryu Aarti","Dashrath Mahal"], inclusions:["AC Cab","Hotel Stays","Breakfast & Dinner"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrival, Saryu Ghat evening aarti."},{day:"Day 2",desc:"Ram Janmabhoomi, Hanuman Garhi, Kanak Bhawan."},{day:"Day 3",desc:"Temple darshan & Departure."}], howToReach:"Fly to Ayodhya Airport (AYJ).", thingsToCarry:"Modest clothing, comfortable shoes.", importantInfo:"Temple queues can be long.", eligibility:"Open to all ages.", location:"Ayodhya, Uttar Pradesh", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp2", title:"Varanasi Spiritual", type:"spiritual", region:"North India", price:"₹10,000", origPrice:"₹16,000", duration:"2N / 3D", guests:"2", tag:"Pilgrimage", img:"https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:118, description:"World-famous Ganga Aarti and ancient spiritual capital of India.", highlights:["Ganga Aarti Dashashwamedh","Kashi Vishwanath Temple","Sarnath Visit","Sunrise Boat Ride"], inclusions:["Boat Ride","Local Cab","Breakfast","Hotel Stay"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrival, Dashashwamedh Ghat evening Ganga Aarti."},{day:"Day 2",desc:"Kashi Vishwanath Temple, Sarnath & Manikarnika Ghat."},{day:"Day 3",desc:"Sunrise boat ride on Ganga & Departure."}], howToReach:"Fly to Lal Bahadur Shastri Airport (VNS).", thingsToCarry:"Modest clothing, comfortable shoes.", importantInfo:"Ganga Aarti starts at sunset.", eligibility:"Open to all ages.", location:"Varanasi, Uttar Pradesh", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp3", title:"Char Dham Yatra", type:"spiritual", region:"North India", price:"₹35,000", origPrice:"₹55,000", duration:"10N / 11D", guests:"2", tag:"Pilgrimage", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", rating:4.9, reviews:92, description:"Divine trek to Yamunotri, Gangotri, Kedarnath, and Badrinath.", highlights:["Yamunotri Temple","Gangotri Dham","Kedarnath Temple","Badrinath Dham"], inclusions:["Local Guide","Yatra Registration","AC Transport"], exclusions:["Flights","Ponky/doli charges"], itinerary:[{day:"Route",desc:"Haridwar → Yamunotri → Gangotri → Kedarnath → Badrinath → Rishikesh."}], howToReach:"Fly to Dehradun Airport (DED).", thingsToCarry:"Warm waterproof clothing, trekking shoes.", importantInfo:"Yatra registration mandatory. Medical fitness required.", eligibility:"Age 12+. Medical certificate may be required.", location:"Yamunotri, Gangotri, Kedarnath, Badrinath", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp4", title:"Vaishno Devi Yatra", type:"spiritual", region:"North India", price:"₹14,000", origPrice:"₹20,000", duration:"3N / 4D", guests:"2", tag:"Pilgrimage", img:"https://images.unsplash.com/photo-1624460915578-be1f960fbaea?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:134, description:"Trek or fly to the holy Bhawan of Mata Vaishno Devi.", highlights:["Helicopter Option Available","Bhairon Temple Visit","Katra Town Stay","Jammu Sightseeing"], inclusions:["Yatra Assistance","Breakfast & Dinner","Transfers"], exclusions:["Flights","Helicopter"], itinerary:[{day:"Day 1",desc:"Arrive Jammu, transfer to Katra."},{day:"Day 2",desc:"Trek/Helicopter to Vaishno Devi Bhawan."},{day:"Day 3",desc:"Bhairon Temple visit."},{day:"Day 4",desc:"Jammu sightseeing & Departure."}], howToReach:"Fly to Jammu Airport (IXJ).", thingsToCarry:"Trekking shoes, warm layers, water bottle.", importantInfo:"Trek is approximately 13km one way.", eligibility:"Open to all ages.", location:"Katra & Vaishno Devi, Jammu & Kashmir", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp5", title:"12 Jyotirlinga Tour", type:"spiritual", region:"North India", price:"₹60,000", origPrice:"₹85,000", duration:"12N / 13D", guests:"2", tag:"Jyotirlinga", img:"https://images.unsplash.com/photo-1545128485-c4805e3e086d?auto=format&fit=crop&w=800&q=80", rating:4.7, reviews:56, description:"Comprehensive pilgrimage covering all 12 sacred Jyotirlingas.", highlights:["All 12 Jyotirlingas","Expert Pandit Guidance","AC Transport","Temple Assistance"], inclusions:["Temple Assistance","Guide","AC Transport","Hotel stays"], exclusions:["Flights","Donations"], itinerary:[{day:"Temples",desc:"Somnath, Nageshwar, Mahakaleshwar, Omkareshwar, Kedarnath, Kashi Vishwanath, Trimbakeshwar, Bhimashankar, Grishneshwar, Rameshwaram, Mallikarjuna, Baidyanath."}], howToReach:"Start from Mumbai or Delhi.", thingsToCarry:"Modest clothing, comfortable shoes.", importantInfo:"Extended journey across multiple states.", eligibility:"Open to all ages.", location:"Multiple locations across India", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp6", title:"Tirupati Balaji", type:"spiritual", region:"South India", price:"₹14,000", origPrice:"₹20,000", duration:"2N / 3D", guests:"2", tag:"Temple", img:"https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:88, description:"VIP darshan of Lord Venkateswara at world-famous Tirumala temple.", highlights:["VIP Darshan Assistance","Tirumala Hills Visit","Padmavathi Temple","Kapila Theertham"], inclusions:["VIP Darshan Help","AC Transfers","Breakfast"], exclusions:["Flights","Donations"], itinerary:[{day:"Day 1",desc:"Arrive Tirupati. Padmavathi Temple."},{day:"Day 2",desc:"Tirumala Hills. Balaji Darshan."},{day:"Day 3",desc:"Kapila Theertham & Departure."}], howToReach:"Fly to Tirupati Airport (TIR).", thingsToCarry:"Modest clothing, ID proof.", importantInfo:"VIP darshan subject to availability.", eligibility:"Open to all ages.", location:"Tirupati & Tirumala, Andhra Pradesh", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp7", title:"Ujjain Mahakal", type:"spiritual", region:"North India", price:"₹8,000", origPrice:"₹12,000", duration:"1N / 2D", guests:"2", tag:"Jyotirlinga", img:"https://images.unsplash.com/photo-1574958269340-fa927503f3dd?auto=format&fit=crop&w=800&q=80", rating:4.7, reviews:72, description:"Divine Bhasma Aarti at Mahakaleshwar — one of the 12 Jyotirlingas.", highlights:["Bhasma Aarti Darshan","Mahakaleshwar Jyotirlinga","Kal Bhairav Temple","Ram Ghat Visit"], inclusions:["Bhasma Aarti Help","Breakfast","Local Cab","Hotel Stay"], exclusions:["Flights","Donations"], itinerary:[{day:"Day 1",desc:"Arrive Ujjain. Mahakaleshwar Darshan & Ram Ghat."},{day:"Day 2",desc:"Kal Bhairav Temple & Departure."}], howToReach:"Fly to Indore Airport (IDR).", thingsToCarry:"Modest clothing, ID proof.", importantInfo:"Bhasma Aarti requires online registration.", eligibility:"Open to all ages.", location:"Ujjain, Madhya Pradesh", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp8", title:"Shirdi Sai Baba", type:"spiritual", region:"South India", price:"₹10,000", origPrice:"₹15,000", duration:"2N / 3D", guests:"2", tag:"Temple", img:"https://images.unsplash.com/photo-1609766934003-2efa4ac75856?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:95, description:"Seek blessings at the sacred shrine of Sai Baba.", highlights:["Sai Baba Temple Darshan","Dwarkamai & Chavadi","Shani Shingnapur Visit","Nashik Vineyard Tour"], inclusions:["Local Cab","Breakfast","Hotel Stay"], exclusions:["Flights","Donations"], itinerary:[{day:"Day 1",desc:"Arrive Shirdi. Sai Baba Temple Darshan."},{day:"Day 2",desc:"Dwarkamai, Chavadi & Shani Shingnapur."},{day:"Day 3",desc:"Nashik excursion & Departure."}], howToReach:"Fly to Shirdi Airport (SAG).", thingsToCarry:"Modest clothing, comfortable shoes.", importantInfo:"Darshan queues can be long on weekends.", eligibility:"Open to all ages.", location:"Shirdi & Shani Shingnapur, Maharashtra", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp9", title:"Pushkar Brahma", type:"spiritual", region:"North India", price:"₹7,000", origPrice:"₹10,000", duration:"1N / 2D", guests:"2", tag:"Temple", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", rating:4.6, reviews:58, description:"Only temple in the world dedicated to Lord Brahma.", highlights:["Brahma Temple","Pushkar Lake Holy Dip","Savitri Mata Temple","Ajmer Sharif Dargah"], inclusions:["Local Sightseeing","Breakfast","Hotel Stay"], exclusions:["Flights","Personal expenses"], itinerary:[{day:"Day 1",desc:"Arrive Pushkar. Brahma Temple & Pushkar Lake."},{day:"Day 2",desc:"Savitri Temple sunrise, Ajmer Sharif & Departure."}], howToReach:"Fly to Jaipur Airport (JAI).", thingsToCarry:"Modest clothing, comfortable shoes.", importantInfo:"Pushkar is a holy town — no leather or alcohol.", eligibility:"Open to all ages.", location:"Pushkar & Ajmer, Rajasthan", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp10", title:"Vrindavan & Mathura", type:"spiritual", region:"North India", price:"₹7,500", origPrice:"₹12,000", duration:"2N / 3D", guests:"2", tag:"Temple", img:"https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:82, description:"Land of Lord Krishna's childhood. Sacred temples and Prem Mandir light show.", highlights:["Banke Bihari Temple","Prem Mandir Light Show","ISKCON Temple","Krishna Janmabhoomi"], inclusions:["Local Transport","Temple Assistance","Breakfast"], exclusions:["Flights","Donations"], itinerary:[{day:"Day 1",desc:"Arrive Mathura. Krishna Janmabhoomi & Vishram Ghat."},{day:"Day 2",desc:"Vrindavan: Banke Bihari, ISKCON, Prem Mandir."},{day:"Day 3",desc:"Govardhan Hill & Departure."}], howToReach:"Fly to Delhi Airport (DEL).", thingsToCarry:"Modest clothing, comfortable shoes.", importantInfo:"Prem Mandir light show in the evening.", eligibility:"Open to all ages.", location:"Mathura & Vrindavan, Uttar Pradesh", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp11", title:"Somnath & Dwarka", type:"spiritual", region:"West India", price:"₹12,000", origPrice:"₹18,000", duration:"3N / 4D", guests:"2", tag:"Jyotirlinga", img:"https://images.unsplash.com/photo-1595435742616-8f8b4133f92c?auto=format&fit=crop&w=800&q=80", rating:4.7, reviews:64, description:"First and most sacred Jyotirlinga at Somnath, combined with Dwarka.", highlights:["Somnath Jyotirlinga","Dwarkadhish Temple","Bet Dwarka Island","Triveni Sangam"], inclusions:["Hotel Stay","Breakfast & Dinner","AC Transport"], exclusions:["Flights","Donations"], itinerary:[{day:"Day 1",desc:"Arrive Somnath. Temple & Triveni Sangam."},{day:"Day 2",desc:"Bhalka Tirth, Veraval & Light Show."},{day:"Day 3",desc:"Transfer to Dwarka. Dwarkadhish Temple."},{day:"Day 4",desc:"Bet Dwarka & Nageshwar. Departure."}], howToReach:"Fly to Rajkot (RAJ) or Ahmedabad (AMD).", thingsToCarry:"Modest clothing, comfortable shoes.", importantInfo:"Somnath Light Show every evening.", eligibility:"Open to all ages.", location:"Somnath & Dwarka, Gujarat", cancellation:"Full refund if cancelled 15+ days before departure." },
  { uid:"sp12", title:"Rameshwaram & Kanyakumari", type:"spiritual", region:"South India", price:"₹15,000", origPrice:"₹22,000", duration:"3N / 4D", guests:"2", tag:"Jyotirlinga", img:"https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?auto=format&fit=crop&w=800&q=80", rating:4.8, reviews:71, description:"Sacred Ramanathaswamy Jyotirlinga and breathtaking sunrise at Kanyakumari.", highlights:["Ramanathaswamy Jyotirlinga","22 Holy Wells Darshan","Kanyakumari Sunrise","Vivekananda Rock"], inclusions:["Hotel Stay","Breakfast & Dinner","AC Transport","Ferry Tickets"], exclusions:["Flights","Donations"], itinerary:[{day:"Day 1",desc:"Arrive Rameshwaram. Temple & 22 Holy Wells."},{day:"Day 2",desc:"Pamban Bridge & Dhanushkodi."},{day:"Day 3",desc:"Transfer to Kanyakumari. Sunset at beach."},{day:"Day 4",desc:"Vivekananda Rock & Sunrise. Departure."}], howToReach:"Fly to Madurai Airport (IXM).", thingsToCarry:"Modest clothing, comfortable shoes.", importantInfo:"22 Holy Wells darshan requires early morning visit.", eligibility:"Open to all ages.", location:"Rameshwaram & Kanyakumari, Tamil Nadu", cancellation:"Full refund if cancelled 15+ days before departure." }
];

const defaultContent = [
  { section:"carousels", key:"popular_heading", value:"Popular Destinations" },
  { section:"carousels", key:"popular_subtitle", value:"Where India goes to holiday" },
  { section:"carousels", key:"spiritual_heading", value:"Spiritual Journeys" },
  { section:"carousels", key:"spiritual_subtitle", value:"Divine destinations await" }
];

const defaultCarouselItems = [
  // Popular Destinations (8)
  { section:"popular", sort_order:1, data_dest:"corbett", name:"Jim Corbett", tag:"Wildlife", meta:"Uttarakhand", image:"https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80", link:"domestic.html" },
  { section:"popular", sort_order:2, data_dest:"kerala", name:"Kerala", tag:"Backwaters", meta:"God's Own Country", image:"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80", link:"domestic.html" },
  { section:"popular", sort_order:3, data_dest:"manali", name:"Manali", tag:"Hill Station", meta:"Himachal Pradesh", image:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80", link:"domestic.html" },
  { section:"popular", sort_order:4, data_dest:"goa", name:"Goa", tag:"Beaches", meta:"Sun & Sand", image:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", link:"domestic.html" },
  { section:"popular", sort_order:5, data_dest:"jaipur", name:"Jaipur", tag:"Heritage", meta:"Rajasthan", image:"https://images.unsplash.com/photo-1595435742616-8f8b4133f92c?auto=format&fit=crop&w=600&q=80", link:"domestic.html" },
  { section:"popular", sort_order:6, data_dest:"shimla", name:"Shimla", tag:"Mountains", meta:"Queen of Hills", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80", link:"domestic.html" },
  { section:"popular", sort_order:7, data_dest:"nainital", name:"Nainital", tag:"Lakes", meta:"Uttarakhand", image:"https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80", link:"domestic.html" },
  { section:"popular", sort_order:8, data_dest:"andaman", name:"Andaman", tag:"Islands", meta:"Bay of Bengal", image:"https://images.unsplash.com/photo-1537956965359-7575183d1f57?auto=format&fit=crop&w=600&q=80", link:"domestic.html" },
  // Spiritual Journeys (8)
  { section:"spiritual", sort_order:1, data_dest:"kedarnath", name:"Kedarnath", tag:"Jyotirlinga", meta:"Uttarakhand", image:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80", link:"spiritual.html" },
  { section:"spiritual", sort_order:2, data_dest:"varanasi", name:"Varanasi", tag:"Holy City", meta:"Uttar Pradesh", image:"https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80", link:"spiritual.html" },
  { section:"spiritual", sort_order:3, data_dest:"amritsar", name:"Amritsar", tag:"Golden Temple", meta:"Punjab", image:"https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80", link:"spiritual.html" },
  { section:"spiritual", sort_order:4, data_dest:"tirupati", name:"Tirupati", tag:"Balaji Temple", meta:"Andhra Pradesh", image:"https://images.unsplash.com/photo-1600112356915-089fba06a781?auto=format&fit=crop&w=600&q=80", link:"spiritual.html" },
  { section:"spiritual", sort_order:5, data_dest:"rameshwaram", name:"Rameshwaram", tag:"Jyotirlinga", meta:"Tamil Nadu", image:"https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&w=600&q=80", link:"spiritual.html" },
  { section:"spiritual", sort_order:6, data_dest:"bodhgaya", name:"Bodh Gaya", tag:"Buddhist Pilgrimage", meta:"Bihar", image:"https://images.unsplash.com/photo-1544016405-c2e4d3312ee4?auto=format&fit=crop&w=600&q=80", link:"spiritual.html" },
  { section:"spiritual", sort_order:7, data_dest:"dwarka", name:"Dwarka", tag:"Jyotirlinga", meta:"Gujarat", image:"https://images.unsplash.com/photo-1609766418204-94aae0ecfab5?auto=format&fit=crop&w=600&q=80", link:"spiritual.html" },
  { section:"spiritual", sort_order:8, data_dest:"haridwar", name:"Haridwar", tag:"Spiritual Gateway", meta:"Uttarakhand", image:"https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=600&q=80", link:"spiritual.html" },
];

const defaultSettings = [
  { key:"phone", value:"+91 84489 19300" },
  { key:"email", value:"info@adventureholidaydestination.com" },
  { key:"address", value:"AJ 52 C, Shalimar Bagh, Delhi – 110088" },
  { key:"website", value:"www.adventureholidaydestination.com" },
  { key:"formspree_id", value:"xnjkjjzo" },
  { key:"facebook", value:"#" },
  { key:"instagram", value:"#" },
  { key:"whatsapp", value:"#" }
];

async function seed() {
  console.log("Seeding database...");

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'domestic',
      region TEXT DEFAULT '',
      price TEXT DEFAULT '',
      orig_price TEXT DEFAULT '',
      duration TEXT DEFAULT '',
      guests TEXT DEFAULT '2',
      tag TEXT DEFAULT '',
      img TEXT DEFAULT '',
      rating REAL DEFAULT 4.5,
      reviews INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      highlights TEXT DEFAULT '[]',
      inclusions TEXT DEFAULT '[]',
      exclusions TEXT DEFAULT '[]',
      itinerary TEXT DEFAULT '[]',
      how_to_reach TEXT DEFAULT '',
      things_to_carry TEXT DEFAULT '',
      important_info TEXT DEFAULT '',
      eligibility TEXT DEFAULT '',
      location TEXT DEFAULT '',
      cancellation TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      package TEXT DEFAULT '',
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(section, key)
    );
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS carousel_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL DEFAULT 'popular',
      sort_order INTEGER DEFAULT 0,
      data_dest TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL DEFAULT '',
      tag TEXT DEFAULT '',
      meta TEXT DEFAULT '',
      image TEXT DEFAULT '',
      link TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const pw = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await db.execute({ sql:"INSERT OR IGNORE INTO users (email, password_hash, name) VALUES (?, ?, ?)", args:[ADMIN_EMAIL, pw, "Admin"] });
  console.log("Admin user created:", ADMIN_EMAIL);

  for (const pkg of [...domesticPackages, ...spiritualPackages]) {
    await db.execute({
      sql:"INSERT OR IGNORE INTO packages (uid,title,type,region,price,orig_price,duration,guests,tag,img,rating,reviews,description,highlights,inclusions,exclusions,itinerary,how_to_reach,things_to_carry,important_info,eligibility,location,cancellation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      args:[pkg.uid,pkg.title,pkg.type,pkg.region,pkg.price,pkg.origPrice,pkg.duration,pkg.guests,pkg.tag,pkg.img,pkg.rating,pkg.reviews,pkg.description,JSON.stringify(pkg.highlights),JSON.stringify(pkg.inclusions),JSON.stringify(pkg.exclusions),JSON.stringify(pkg.itinerary),pkg.howToReach,pkg.thingsToCarry,pkg.importantInfo,pkg.eligibility,pkg.location,pkg.cancellation]
    });
  }
  console.log("Packages seeded:", domesticPackages.length + spiritualPackages.length);

  for (const c of defaultContent) {
    await db.execute({ sql:"INSERT OR REPLACE INTO content (section,key,value,updated_at) VALUES (?,?,?,datetime('now'))", args:[c.section,c.key,c.value] });
  }
  console.log("Content seeded:", defaultContent.length, "rows");

  for (const s of defaultSettings) {
    await db.execute({ sql:"INSERT OR REPLACE INTO settings (key,value,updated_at) VALUES (?,?,datetime('now'))", args:[s.key,s.value] });
  }
  console.log("Settings seeded:", defaultSettings.length, "rows");

  await db.execute("DELETE FROM carousel_items");
  for (const c of defaultCarouselItems) {
    await db.execute({ sql:"INSERT INTO carousel_items (section,sort_order,data_dest,name,tag,meta,image,link) VALUES (?,?,?,?,?,?,?,?)", args:[c.section,c.sort_order,c.data_dest,c.name,c.tag,c.meta,c.image,c.link] });
  }
  console.log("Carousel items seeded:", defaultCarouselItems.length);

  const hotels = [
    {
      uid: "h1", name: "Hotel Abhyudyam Ganga", type: "hotel",
      location: "Har Ki Pauri, Haridwar", region: "Uttarakhand",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
      ]),
      description: "A premium riverside hotel steps away from the sacred Har Ki Pauri ghat. Enjoy panoramic Ganga views, world-class amenities, and easy access to Haridwar's spiritual landmarks. Perfect for pilgrims and leisure travellers seeking comfort by the holy river.",
      rating: 4.7,
      amenities: JSON.stringify(["Free WiFi", "Restaurant", "Room Service", "Ganga View Rooms", "AC Rooms", "Parking", "Travel Desk", "Laundry"]),
      meal_plans: JSON.stringify([
        { name: "EP (European Plan)", description: "Room only — no meals included", price: "" },
        { name: "CP (Continental Plan)", description: "Room + breakfast for all guests", price: "+₹500/night" },
        { name: "MAP (Modified American Plan)", description: "Room + breakfast + one meal (lunch or dinner)", price: "+₹1,200/night" }
      ]),
      room_types: JSON.stringify([
        { name: "Deluxe Room", price: "₹3,200", plan: "EP", guests: "2", bed: "Queen Bed", size: "280 sq ft", amenities: ["AC", "WiFi", "TV", "Minibar", "Garden View"] },
        { name: "Super Deluxe Room", price: "₹4,500", plan: "EP", guests: "2", bed: "King Bed", size: "350 sq ft", amenities: ["AC", "WiFi", "TV", "Minibar", "Ganga View", "Sofa"] },
        { name: "Executive Suite", price: "₹6,800", plan: "EP", guests: "2", bed: "King Bed", size: "480 sq ft", amenities: ["AC", "WiFi", "TV", "Minibar", "Ganga View", "Living Area", "Balcony"] },
        { name: "Family Room", price: "₹5,500", plan: "EP", guests: "4", bed: "2 Queen Beds", size: "420 sq ft", amenities: ["AC", "WiFi", "TV", "Minibar", "Garden View", "Extra Beds Available"] }
      ]),
      highlights: JSON.stringify(["Walking distance to Har Ki Pauri", "Panoramic Ganga river views", "Rooftop restaurant with Aarti view", "Complimentary yoga sessions", "24/7 room service"]),
      policies: "Check-in: 2:00 PM | Check-out: 12:00 PM. Valid ID proof required. Extra bed charges: ₹1,000/night. Children under 5 stay free. Cancellation: Free cancellation up to 48 hours before check-in.",
      how_to_reach: "Nearest airport: Jolly Grant Airport, Dehradun (35 km). Nearest railway station: Haridwar Junction (2 km). Auto/taxi available from station.",
      featured: 1
    },
    {
      uid: "h2", name: "Maulik Mansion Resort", type: "resort",
      location: "Ramnagar, Jim Corbett", region: "Uttarakhand",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80"
      ]),
      description: "Nestled in the wilderness of Jim Corbett National Park, Maulik Mansion Resort offers an immersive jungle experience with luxury amenities. Wake up to bird songs, enjoy riverside dining, and embark on thrilling wildlife safaris — all from the comfort of a premium resort.",
      rating: 4.8,
      amenities: JSON.stringify(["Free WiFi", "Swimming Pool", "Spa", "Restaurant", "Bar", "Jungle Safari", "Bonfire", "Parking", "Conference Hall", "Kids Play Area"]),
      meal_plans: JSON.stringify([
        { name: "EP (European Plan)", description: "Room only — no meals included", price: "" },
        { name: "CP (Continental Plan)", description: "Room + breakfast buffet", price: "+₹800/night" },
        { name: "MAP (Modified American Plan)", description: "Room + breakfast + lunch or dinner", price: "+₹1,800/night" },
        { name: "AP (American Plan)", description: "Room + all meals (breakfast, lunch, dinner)", price: "+₹2,800/night" }
      ]),
      room_types: JSON.stringify([
        { name: "Deluxe Cottage", price: "₹5,500", plan: "EP", guests: "2", bed: "Queen Bed", size: "320 sq ft", amenities: ["AC", "WiFi", "TV", "Balcony", "Garden View"] },
        { name: "Super Deluxe Cottage", price: "₹7,200", plan: "EP", guests: "2", bed: "King Bed", size: "400 sq ft", amenities: ["AC", "WiFi", "TV", "Balcony", "River View", "Sitting Area"] },
        { name: "Superior Bath Tub", price: "₹8,500", plan: "EP", guests: "2", bed: "King Bed", size: "450 sq ft", amenities: ["AC", "WiFi", "TV", "Bathtub", "Balcony", "River View"] },
        { name: "Superior Jacuzzi", price: "₹10,000", plan: "EP", guests: "2", bed: "King Bed", size: "500 sq ft", amenities: ["AC", "WiFi", "TV", "Jacuzzi", "Balcony", "River View", "Minibar"] },
        { name: "Cottage", price: "₹6,000", plan: "EP", guests: "2", bed: "Queen Bed", size: "350 sq ft", amenities: ["AC", "WiFi", "TV", "Private Sit-out", "Garden"] },
        { name: "Terrace Garden", price: "₹9,000", plan: "EP", guests: "2", bed: "King Bed", size: "480 sq ft", amenities: ["AC", "WiFi", "TV", "Terrace", "Garden", "Outdoor Seating"] },
        { name: "Luxury Suite Plunge Pool", price: "₹15,000", plan: "EP", guests: "2", bed: "King Bed", size: "700 sq ft", amenities: ["AC", "WiFi", "TV", "Private Plunge Pool", "Balcony", "River View", "Minibar", "Living Area"] }
      ]),
      highlights: JSON.stringify(["Inside Jim Corbett buffer zone", "Riverside location", "Guided jungle safari included on request", "Outdoor swimming pool", "Bonfire & barbecue evenings", "Nature walks with expert naturalist"]),
      policies: "Check-in: 2:00 PM | Check-out: 11:00 AM. Valid ID proof required. Safari bookings subject to forest department availability. Cancellation: Free cancellation up to 72 hours before check-in.",
      how_to_reach: "Nearest airport: Pantnagar Airport (80 km). Nearest railway station: Ramnagar (5 km). Resort provides pickup/drop on request (charges apply).",
      featured: 1
    }
  ];

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'hotel',
      location TEXT DEFAULT '',
      region TEXT DEFAULT '',
      image TEXT DEFAULT '',
      gallery TEXT DEFAULT '[]',
      description TEXT DEFAULT '',
      rating REAL DEFAULT 4.5,
      amenities TEXT DEFAULT '[]',
      meal_plans TEXT DEFAULT '[]',
      room_types TEXT DEFAULT '[]',
      highlights TEXT DEFAULT '[]',
      policies TEXT DEFAULT '',
      how_to_reach TEXT DEFAULT '',
      featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS hotel_enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      hotel TEXT DEFAULT '',
      hotel_uid TEXT DEFAULT '',
      room_type TEXT DEFAULT '',
      check_in TEXT DEFAULT '',
      check_out TEXT DEFAULT '',
      guests TEXT DEFAULT '1',
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  for (const h of hotels) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO hotels (uid,name,type,location,region,image,gallery,description,rating,amenities,meal_plans,room_types,highlights,policies,how_to_reach,featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      args: [h.uid, h.name, h.type, h.location, h.region, h.image, h.gallery, h.description, h.rating, h.amenities, h.meal_plans, h.room_types, h.highlights, h.policies, h.how_to_reach, h.featured]
    });
  }
  console.log("Hotels seeded:", hotels.length);

  console.log("Seeding complete!");
}

seed().catch(console.error);
