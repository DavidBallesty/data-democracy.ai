document.addEventListener('DOMContentLoaded', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Append a div to display coordinates
    const coordsDiv = d3.select('body').append('div')
        .attr('id', 'coords-display')
        .style('position', 'absolute')
        .style('top', '10px')
        .style('left', '10px')
        .style('color', 'yellow');

    const svg = d3.select('#globe-container').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', '0')
        .style('left', '0');

    // You might need to adjust the projection settings for a flat map image
    const projection = d3.geoMercator()
        .center([0, 20]) // This should be adjusted depending on your image
        .scale(width / (2 * Math.PI)) // This should be adjusted as well
        .translate([width / 2, height / 2]);

    // Add a mousemove listener to the SVG
    svg.on('mousemove', function(event) {
        // Get the mouse coordinates from the event
        const [x, y] = d3.pointer(event);
        // Use the projection's invert method to get the geographic coordinates from the pixel coordinates
        const coords = projection.invert([x, y]);
        // Update the coords-display div with the coordinates
        coordsDiv.text(`Coordinates: ${coords}`);
    });
  
    // Use the variable defined in the HTML file
/*     d3.json(worldMapPath).then(function (world) {
        svg.selectAll('.country')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append('path')
            .attr('class', 'country')
            .attr('d', path); */

    const cities = [
    { name: 'New York City', coordinates: [-76.0060, 41.7128] },
    { name: 'Toronto', coordinates: [-79.3832, 43.6532] },
    { name: 'Washington', coordinates: [-79, 38]},    
    { name: 'Charlotte', coordinates: [-83.8431, 35.2271] },
    { name: 'Denver', coordinates: [-107.9903, 40.7392] },
    { name: 'Los Angeles', coordinates: [-113.2437, 36.0522] },    
    { name: 'San Francisco', coordinates: [-117.4194, 37.7749] },

    { name: 'Mexico City', coordinates: [173.1332, -30.4326] },
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

    { name: 'Istanbul', coordinates: [12.9784, 41.0082]
 },
    { name: 'Johannesburg', coordinates: [13.0473, -18.2041] },
    { name: 'Cairo', coordinates: [14.2357, 32.0444] },
    { name: 'Lagos', coordinates: [-8.3792, 12.5244] },

    { name: 'Hong Kong', coordinates: [38.1694, 25.3193] },
    { name: 'Shanghai', coordinates: [96.4737, 32.2304] },    
    { name: 'Beijing', coordinates: [93.4737, 36.2304] },
    { name: 'Singapore', coordinates: [79.8198, 8.3521] },

    { name: 'Tokyo', coordinates: [111.6917, 37.6895] },

    { name: 'Sydney', coordinates: [120.2093, -27.8688] },
    { name: 'Melbourne', coordinates: [117.9631, -29.8136] },

    { name: 'Seoul', coordinates: [126.9780, 37.5665] },

    { name: 'Dubai', coordinates: [55.2708, 25.2048] },


    { name: 'Oslo', coordinates: [10.7522, 59.9139] },

    { name: 'Chennai', coordinates: [80.2707, 13.0827] },

    { name: 'Bangkok', coordinates: [100.5018, 13.7563] },
    { name: 'Seoul', coordinates: [126.9780, 37.5665] },
    { name: 'Nagoya', coordinates: [136.9066, 35.1815] },
    { name: 'Shenzhen', coordinates: [114.0579, 22.5431] },
    { name: 'Jakarta', coordinates: [106.8650, -6.1751] },
    { name: 'Guangzhou', coordinates: [113.2644, 23.1291] },
    { name: 'Bangalore', coordinates: [77.5946, 12.9716] },
    { name: 'Manila', coordinates: [120.9842, 14.5995] },


    { name: 'Kolkata', coordinates: [88.3639, 22.5726] },
    { name: 'Dhaka', coordinates: [90.4125, 23.8103] },
    { name: 'Karachi', coordinates: [67.0099, 24.8615] },


    { name: 'Delhi', coordinates: [77.1025, 28.7041] },
    { name: 'Mumbai', coordinates: [72.8777, 19.0760] },


    ];            


    // Add circles for each city
    svg.selectAll('.city')
        .data(cities)
        .enter().append('circle')
        .attr('class', 'city')
        .attr('cx', d => projection(d.coordinates)[0])
        .attr('cy', d => projection(d.coordinates)[1])
        .attr('r', '5')
        .attr('fill', 'yellow');

    // Add city labels
    svg.selectAll('.city-label')
        .data(cities)
        .enter().append('text')
        .attr('class', 'city-label')
        .attr('x', d => projection(d.coordinates)[0])
        .attr('y', d => projection(d.coordinates)[1] + 15) // Adjust to position labels correctly
        .text(d => d.name)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '10px');
});

