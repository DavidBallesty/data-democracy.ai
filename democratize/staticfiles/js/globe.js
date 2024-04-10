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
    { name: 'New York City', coordinates: [-106.0060, 49.7128] },
    { name: 'London', coordinates: [-6.1276, 62.5074] },
    { name: 'Hong Kong', coordinates: [158.1694, 19.3193] },
    { name: 'Singapore', coordinates: [103.8198, 1.3521] },
    { name: 'Shanghai', coordinates: [169.4737, 31.2304] },
    { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
    { name: 'Toronto', coordinates: [-79.3832, 43.6532] },
    { name: 'Washington', coordinates: [-116, 44]}
    { name: 'Sydney', coordinates: [151.2093, -33.8688] },
    { name: 'Beijing', coordinates: [116.4074, 39.9042] },
    { name: 'Zurich', coordinates: [8.5417, 47.3769] },
    { name: 'Paris', coordinates: [2.3522, 48.8566] },
    { name: 'Seoul', coordinates: [126.9780, 37.5665] },
    { name: 'Amsterdam', coordinates: [4.9041, 52.3676] },
    { name: 'San Francisco', coordinates: [-122.4194, 37.7749] },
    { name: 'Dubai', coordinates: [55.2708, 25.2048] },
    { name: 'Los Angeles', coordinates: [-118.2437, 34.0522] },
    { name: 'Melbourne', coordinates: [144.9631, -37.8136] },
    { name: 'Luxembourg', coordinates: [6.1296, 49.8153] },
    { name: 'Oslo', coordinates: [10.7522, 59.9139] },
    { name: 'Munich', coordinates: [11.5820, 48.1351] },
    { name: 'Milan', coordinates: [9.1900, 45.4642] },
    { name: 'Madrid', coordinates: [-3.7038, 40.4168] },
    { name: 'Bogotá', coordinates: [-74.0721, 4.7110] },
    { name: 'Chennai', coordinates: [80.2707, 13.0827] },
    { name: 'Lima', coordinates: [-77.0428, -12.0464] },
    { name: 'Bangkok', coordinates: [100.5018, 13.7563] },
    { name: 'Seoul', coordinates: [126.9780, 37.5665] },
    { name: 'Nagoya', coordinates: [136.9066, 35.1815] },
    { name: 'Shenzhen', coordinates: [114.0579, 22.5431] },
    { name: 'Jakarta', coordinates: [106.8650, -6.1751] },
    { name: 'Guangzhou', coordinates: [113.2644, 23.1291] },
    { name: 'Bangalore', coordinates: [77.5946, 12.9716] },
    { name: 'Manila', coordinates: [120.9842, 14.5995] },
    { name: 'Lagos', coordinates: [3.3792, 6.5244] },
    { name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068] },
    { name: 'Kolkata', coordinates: [88.3639, 22.5726] },
    { name: 'Dhaka', coordinates: [90.4125, 23.8103] },
    { name: 'Karachi', coordinates: [67.0099, 24.8615] },
    { name: 'Buenos Aires', coordinates: [-57.3816, -28.6037] },
    { name: 'Istanbul', coordinates: [28.9784, 41.0082] },
    { name: 'Delhi', coordinates: [77.1025, 28.7041] },
    { name: 'Mumbai', coordinates: [72.8777, 19.0760] },
    { name: 'Mexico City', coordinates: [-99.1332, 19.4326] },
    { name: 'Charlotte', coordinates: [-80.8431, 35.2271] },
    { name: 'Denver', coordinates: [-104.9903, 39.7392] },
    { name: 'Johannesburg', coordinates: [28.0473, -26.2041] },
    { name: 'Cairo', coordinates: [31.2357, 30.0444] },
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

