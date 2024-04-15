

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    const svg = setupSVG();
    const projection = defineProjection();
    const cities = defineCities();
    console.log(`Cities defined: ${cities.length}`);

    console.log("Drawing cities");
    drawCities(svg, cities, projection); 
    
    console.log("Drawing city labels");
    drawCityLabels(svg, cities, projection);

    console.log("Animating city links");
    animateCityLinks(svg, cities, projection); // Call to start the animation
});

// Define other functions like setupSVG, defineProjection, drawCities, and drawCityLabels...
function animateCityLinks(svg, cities, projection) {
    console.log("Animating city links");

    const delayBetweenPairs = 3000; // Delay of 3 seconds between each pair

    cities.forEach((city, i) => {
        if (i < cities.length - 1) {
            const nextCity = cities[i + 1];
            const delayForThisPair = i * delayBetweenPairs;

            console.log(`Scheduling animation for city pair ${i} with a delay of ${delayForThisPair}ms`);

            // Use an Immediately Invoked Function Expression (IIFE) to capture the current value of i
            setTimeout((function(index) {
                return function() {
                    console.log(`Starting animation for city pair ${index}`);
                    // Start the animation for the current city pair
                    startAnimationForCityPair(svg, city, nextCity, projection);
                }
            })(i), delayForThisPair);
        }
    });
}

function startAnimationForCityPair(svg, city, nextCity, projection) {
    console.log(`Animating from ${city.name} to ${nextCity.name}`);        // Calculate the positions of the cities
    const startPos = projection(city.coordinates);
    const endPos = projection(nextCity.coordinates);

    // Append a line to represent the path
    const path = svg.append("line")
        .attr("x1", startPos[0])
        .attr("y1", startPos[1])
        .attr("x2", startPos[0]) // start at the city position
        .attr("y2", startPos[1])
        .attr("stroke", "cyan")
        .attr("stroke-width", "2");

    // Append a circle to represent the bright dot at the front
    const movingDot = svg.append("circle")
        .attr("cx", startPos[0])
        .attr("cy", startPos[1])
        .attr("r", "5")
        .attr("fill", "yellow");

    // Function to animate the line and dot from start to end
    const animateLineAndDot = () => {
        path.transition()
            .duration(5000) // Duration of the animation in milliseconds
            .attr("x2", endPos[0])
            .attr("y2", endPos[1])
            .on("end", () => {
                path.remove(); // Remove the path after transition
                movingDot.remove(); // Remove the moving dot after transition
            });

        movingDot.transition()
            .duration(5000)
            .attr("cx", endPos[0])
            .attr("cy", endPos[1])
            .on("end", () => {
                movingDot.attr("cx", startPos[0]);
                movingDot.attr("cy", startPos[1]);
            });
    };

    // Start the animation
    animateLineAndDot();
}

// Rest of the globe.js code...


function setupSVG() {
    console.log("Setting up SVG");
    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = d3.select('#globe-container').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', '0')
        .style('left', '0');
    console.log(`SVG dimensions set: width=${width}, height=${height}`);
    return svg;
}
function animateCityLinks(svg, cities, projection) {
    console.log("Animating city links");

    // Assuming cities is an array of your city objects with a 'coordinates' property
    cities.forEach((city, i) => {
        // Ensure that we have the next city to draw a line to
        if (i < cities.length - 1) {
            const nextCity = cities[i + 1];

            // Calculate the positions of the cities
            const startPos = projection(city.coordinates);
            const endPos = projection(nextCity.coordinates);

            // Append a line to represent the path
            const path = svg.append("line")
                .attr("x1", startPos[0])
                .attr("y1", startPos[1])
                .attr("x2", startPos[0]) // start at the city position
                .attr("y2", startPos[1])
                .attr("stroke", "cyan")
                .attr("stroke-width", "2");

            // Append a circle to represent the bright dot at the front
            const movingDot = svg.append("circle")
                .attr("cx", startPos[0])
                .attr("cy", startPos[1])
                .attr("r", "5")
                .attr("fill", "yellow");

            // Function to animate the line and dot from start to end
            const animateLineAndDot = () => {
                path.transition()
                    .duration(3000) // Duration of the animation in milliseconds
                    .attr("x2", endPos[0])
                    .attr("y2", endPos[1])
                    .on("end", () => { // When the line animation is done, loop it
                        path.attr("x2", startPos[0]);
                        path.attr("y2", startPos[1]);
                        movingDot.attr("cx", startPos[0]);
                        movingDot.attr("cy", startPos[1]);
                        animateLineAndDot(); // Restart the animation
                    });

                movingDot.transition()
                    .duration(3000)
                    .attr("cx", endPos[0])
                    .attr("cy", endPos[1])
                    .on("end", () => {
                        movingDot.attr("cx", startPos[0]);
                        movingDot.attr("cy", startPos[1]);
                    });
            };

            // Start the animation
            animateLineAndDot();
        }
    });
}

function defineProjection() {
    console.log("Defining projection");
    const width = window.innerWidth;
    const height = window.innerHeight;
    const projection = d3.geoMercator().center([0, 20]).scale(width / (2 * Math.PI)).translate([width / 2, height / 2]);
    console.log(`Projection defined with center [0,20], scale based on width`);
    return projection;
}

function defineCities() {
    console.log("Defining cities");
    // Insert your actual cities data here
    return [
        { name: 'New York City', coordinates: [-76.0060, 41.7128] },
        { name: 'Toronto', coordinates: [-79.3832, 43.6532] },
        { name: 'Washington', coordinates: [-79, 38]},    
        { name: 'Charlotte', coordinates: [-83.8431, 35.2271] },
        { name: 'Denver', coordinates: [-107.9903, 40.7392] },
        { name: 'Los Angeles', coordinates: [-113.2437, 36.0522] },    
        { name: 'San Francisco', coordinates: [-117.4194, 37.7749] },
        { name: 'Mexico City', coordinates: [-101.1332, 21.4326] },
        { name: 'Bogotá', coordinates: [-76.0721, 8.5110] },
        { name: 'Lima', coordinates: [-81.0428, -5.0464] },
        { name: 'Rio de Janeiro', coordinates: [-53.1729, -18.9068] },
        { name: 'Buenos Aires', coordinates: [-64.3816, -30.6037] },
        { name: 'Santiago', coordinates: [-74.3816, -26.6037] },
        { name: 'London', coordinates: [-12.1276, 49.5074] },
        { name: 'Dublin', coordinates: [-17.1276, 50.5074] },    
        { name: 'Madrid', coordinates: [-14.7038, 42.4168] },
         { name: 'Paris', coordinates: [-10.3522, 46.8566] },
        { name: 'Amsterdam', coordinates: [-4.9041, 51.3676] },
        { name: 'Luxembourg', coordinates: [-7.1296, 48.8153] },
        { name: 'Munich', coordinates: [0, 47.1351] },
        { name: 'Zurich', coordinates: [-3.1900, 45.4642] },
        { name: 'Milan', coordinates: [-5.5417, 45.3769] },
        { name: 'Istanbul', coordinates: [12.9784, 41.0082] },
        { name: 'Johannesburg', coordinates: [13.0473, -18.2041] },
        { name: 'Cairo', coordinates: [14.2357, 32.0444] },
        { name: 'Lagos', coordinates: [-8.3792, 12.5244] },
        { name: 'Shanghai', coordinates: [96.4737, 32.2304] },    
        { name: 'Beijing', coordinates: [93.4737, 36.2304] },
        { name: 'Singapore', coordinates: [79.8198, 8.3521] },
        { name: 'Tokyo', coordinates: [111.6917, 37.6895] },
        { name: 'Sydney', coordinates: [120.2093, -27.8688] },
        { name: 'Melbourne', coordinates: [117.9631, -29.8136] },
        { name: 'Seoul', coordinates: [100.9780, 39.5665] },
        { name: 'Dubai', coordinates: [37.2708, 28.2048] },
        { name: 'Oslo', coordinates: [-2.7522, 57.9139] },
        { name: 'Chennai', coordinates: [61.2707, 19.0827] },
        { name: 'Bangkok', coordinates: [77.5018, 17.7563] },
        { name: 'Nagoya', coordinates: [107.9066, 35.1815] },
        { name: 'Jakarta', coordinates: [82.8650, -0.5] },
        { name: 'Hong Kong', coordinates: [89.2644, 26.1291] },
        { name: 'Moscow', coordinates: [21.5946, 36.9716] },
        { name: 'Manila', coordinates: [97.9842, 19.5995] },
        { name: 'Kolkata', coordinates: [67.0099, 24.8615] },
        { name: 'Delhi', coordinates: [57.1025, 31.7041] },
        { name: 'Mumbai', coordinates: [51.8777, 23.0760] },
        // Add more cities as needed
    ];
}

function createCityLinks(cities) {
    console.log("Creating links between cities");
    let links = [];
    for (let i = 0; i < cities.length - 1; i++) {
        links.push({
            source: cities[i].coordinates,
            target: cities[i + 1].coordinates
        });
    }
    return links;
}

function drawCityLinks(svg, links, projection) {
    console.log(`Attempting to draw ${links.length} links`);
    const linkGenerator = d3.linkHorizontal()
        .x(d => projection(d)[0])
        .y(d => projection(d)[1]);

    const drawnLinks = svg.selectAll('.link')
        .data(links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', linkGenerator)
        .style('stroke', 'cyan')
        .style('stroke-width', '2px')
        .style('fill', 'none');

    console.log(`Links drawn: ${svg.selectAll('.link').size()}`);
}

function drawCities(svg, cities, projection) {
    console.log(`Drawing ${cities.length} cities`);
    svg.selectAll('.city')
        .data(cities)
        .enter().append('circle')
        .attr('class', 'city')
        .attr('cx', d => projection(d.coordinates)[0])
        .attr('cy', d => projection(d.coordinates)[1])
        .attr('r', '5') 
        .attr('fill', 'yellow');

    console.log(`Cities drawn: ${svg.selectAll('.city').size()}`);
}

function drawCityLabels(svg, cities, projection) {
    console.log(`Adding labels to ${cities.length} cities`);
    svg.selectAll('.city-label')
        .data(cities)
        .enter().append('text')
        .attr('class', 'city-label')
        .attr('x', d => projection(d.coordinates)[0])
        .attr('y', d => projection(d.coordinates)[1] + 15)
        .text(d => d.name)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '10px');

    console.log(`City labels added: ${svg.selectAll('.city-label').size()}`);
}
