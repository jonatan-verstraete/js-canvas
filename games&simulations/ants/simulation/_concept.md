# MOVEMENT
move to a new target which has a random distance and a noise angle

During this phase ants will random walk: at each step there is a 20% probability of changing

They random walk until they will smell a seed far at most 2 patches, they will approach and



# reach nest
- will deposit the seed and will turn 180 degrees going back to the food source and so on

# TRACE
** ants should leavea trace behind for otherr ants to follow
-> when food is found other should (?) follow this trace and form a route which they follow (a lot less noise)

FOOD: when found food leave trace when returnning to colony
-> evaporation of trail gives ant possibility of tracing shortest route
-> other workes follow trail


They will also release a quantity of home-pheromone increasingly smaller as they walk
away from nest (10% less at each step).

evaporation !!

when food source is gone and ant still followsapth to food, he will continue to wander in a direction  range 270deg


# END_RESULT, own concept (not nescesserally based on truth)

2 tracks:
    - food: if ant has walked path before and knows it is promesing
        -> 90% chance of following
    - wander: normal scent
        -> lower percentage of ants following it


lineofSight = composition of senses
    
1. if track found in lineofSight:
        moveTowards track.direction with speed track.pheromone+randomness[1]
     else:
        go wander 270deg but high possebility of going straight

2. if food in lineofSight:
    moveTowards food
    if distance to food < 2:
        takefood()
        target = home

3. if distance to home < 2:
    dropload
    target = lastfood
        

[1]: pheromone probably isnt 100%acurate as itis a track. So the ant probably follows the direction of the piece of track
This we can do, but might be too complicated (yet), so instead we add a randomness of innacuracy



class Ant:
    evaporationRate = randfloat // when he leacves scents
    accuracy = randfloat //how accurate he performes his jobs
