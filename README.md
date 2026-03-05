<img width="2075" alt="earthquake2" src="https://github.com/njgeorge000158/Earthquake-Visualization-with-Leaflet/assets/137228821/c3caf8c4-510a-419f-95dc-9d9a3c49b176">

----

# **USGS Earthquake Visualization and Heatmap Toolkits: Mapping the Living Planet in Real Time**

----

## **Project Overview**

The United States Geological Survey (USGS) occupies a unique and critical position in the landscape of American scientific institutions. Charged with monitoring natural hazards, tracking ecosystem and environmental health, and quantifying the impacts of climate and land-use change, the USGS collects an extraordinary volume of seismic data from monitoring stations distributed across the globe — every single day. The scale of this data collection is impressive; the agency's ability to communicate it to the public and to policymakers has historically lagged behind.

The gap between data richness and public accessibility is precisely the problem these toolkits are designed to solve. The Earthquake Visualization Toolkit and the Earthquake Heatmap Toolkit are two complementary, browser-based interactive mapping applications that retrieve live earthquake data directly from the USGS GeoJSON feed and render it as dynamic, explorable visualizations — transforming an overwhelming stream of seismic readings into an intuitive and informative picture of planetary activity. Together, they give scientists, educators, journalists, government officials, and curious members of the public a powerful and accessible window into the Earth's ongoing seismic story.

Both toolkits are built using JavaScript, Leaflet.js, and the Mapbox tile API, with data fetched in real time from the USGS GeoJSON endpoint. The result is a pair of tools that are always current — automatically reflecting the most recent seismic events without requiring any manual data updates.

---

## **Toolkit 1: The Earthquake Visualization Toolkit**

<img width="2077" alt="earthquake1" src="https://github.com/njgeorge000158/Earthquake-Visualization-with-Leaflet/assets/137228821/ebd2e584-e4c3-439f-85d5-6b72027cc0e7">

The Earthquake Visualization Toolkit presents the global earthquake record for the selected time window — defaulting to the past 30 days — as a richly encoded scatter map plotted over an OpenStreetMap base layer. Every recorded seismic event is represented as a circle marker positioned at its precise geographic coordinates. Two visual encoding channels communicate the key attributes of each earthquake simultaneously and intuitively: marker size encodes magnitude (larger circles indicate stronger earthquakes) and marker color encodes depth (a gradient from green for shallow events through yellow and orange to deep red for the deepest events). This dual encoding allows a user to assess both the intensity and the subsurface character of seismic activity at a glance, without needing to click on a single marker.

The global view in the above image immediately reveals the defining structural feature of the world's seismic landscape: the overwhelming concentration of earthquake activity along tectonic plate boundaries. The dark red boundary lines overlaid on the map — representing the world's major fault systems and plate edges — trace a pattern that the earthquake markers follow with striking fidelity. The western coast of North and South America, the Aleutian Islands arc, the western Pacific rim from Japan through the Philippines and Indonesia, the Mediterranean basin, and the Himalayan collision zone all light up with dense clusters of markers. The interior of large continental plates — central North America, Africa, Australia, northern Asia — is almost entirely clear, confirming the plate tectonics model in vivid visual terms.

The west coast of North America deserves particular attention. The dense cluster of markers stretching from southern California through the Pacific Northwest and into Alaska spans nearly the full color spectrum from green to deep red, indicating a wide range of both magnitudes and depths — from shallow, moderate events near the surface to deeper, higher-magnitude events along the subduction zones. The single large green circle in the upper right of the map, positioned over far eastern Russia or the Bering Sea region, represents a notably high-magnitude shallow event — its size indicating significant magnitude and its color indicating relatively shallow depth.

<img width="848" alt="earthquake3" src="https://github.com/njgeorge000158/Earthquake-Visualization-with-Leaflet/assets/137228821/36d6a80e-f866-4061-9d54-f44e151006ef">

The above image shows the popup functionality that makes the Visualization Toolkit an active research and education tool rather than a passive display. Clicking any marker opens a detailed information panel anchored to that event's map position. The example shown — M 4.4 in the North Atlantic Ocean, dated 2/24/2024 — displays the event's full data record: location name, date, magnitude (4.40), depth (10.00 km), latitude (35.1110), and longitude (-49.4218), with a hyperlinked title that connects directly to the USGS event page for additional detail. This popup system means that every one of the hundreds or thousands of markers on the map is individually queryable — transforming the visualization from a summary chart into a navigable database of seismic events.

The toolbar at the top of the Visualization Toolkit provides three dropdown controls — time window, magnitude filter, and depth filter — alongside a button that navigates directly to the companion Heatmap Toolkit. This navigation architecture allows users to move fluidly between the two modes of visualization, using the precise event-level detail of the scatter map and the spatial density perspective of the heatmap in combination.

---

## **Toolkit 2: The Earthquake Heatmap Toolkit**

The Earthquake Heatmap Toolkit reframes the same USGS seismic data through an entirely different visual lens. Rather than representing each earthquake as an individually encoded marker, the heatmap aggregates event density into a continuous color gradient — transitioning from cool blue for low-density zones through green and yellow to intense red for the highest concentrations of seismic activity. This approach sacrifices per-event detail in exchange for a dramatically clearer picture of the spatial distribution and relative intensity of earthquake activity across the globe.

<img width="2078" alt="earthquake4" src="https://github.com/njgeorge000158/Earthquake-Visualization-with-Leaflet/assets/137228821/972656fa-fa8f-44f2-98f8-671ef417bbbf">

The above image shows the Heatmap Toolkit in its default state over a grayscale Mapbox base layer. The result is one of the most visually compelling representations of global seismicity possible: the planet's major seismic zones emerge as glowing heat signatures against the neutral gray background, making the geographic pattern of tectonic activity immediately and viscerally apparent even to a viewer with no seismological background. The three dominant heat signatures visible in Image 3 are the western United States and Alaska (a large, intensely red cluster in the upper left), Central America and northwestern South America (a prominent elongated red zone), and the western Pacific arc from Japan through Southeast Asia and Indonesia (a sweeping red-to-orange band across the right side of the map). The Mediterranean and Middle East zone shows a more diffuse yellow-green signature, indicating moderate but geographically distributed activity. The South Atlantic and Indian Oceans show scattered isolated hotspots — consistent with mid-ocean ridge activity along spreading centers where tectonic plates are pulling apart rather than colliding.

<img width="2077" alt="earthquake5" src="https://github.com/njgeorge000158/Earthquake-Visualization-with-Leaflet/assets/137228821/655b2e29-5a75-4ef2-9095-b5032f67ddec">

The above image reveals the Heatmap Toolkit's layer control panel — a critical feature that dramatically expands the tool's flexibility. Four base map options are available: Grayscale Map, Outdoors Map, Satellite Map, and Dark Map. Two overlay layers can be toggled independently: Heatmap and Earthquakes. This combination means users can display the heatmap alone, the individual earthquake markers alone, or both simultaneously — on any of four different base map styles. The ability to switch to a Satellite base layer while displaying both heatmap and earthquake marker overlays, for example, would allow a geologist to correlate seismic activity directly with visible terrain features such as mountain ranges, ocean trenches, and coastal morphology. The Dark Map option would make the heatmap's color gradient particularly vivid and striking for presentation contexts.

<img width="528" alt="earthquake6" src="https://github.com/njgeorge000158/Earthquake-Visualization-with-Leaflet/assets/137228821/23df7d57-1066-418d-94f8-a8138240a220">

The above image demonstrates the heatmap's popup functionality, which mirrors the Visualization Toolkit's event-level detail. Clicking any individual earthquake point marker within the heatmap view opens the same detailed popup — in this case, M 4.4 in the Tristan da Cunha region of the South Atlantic, dated 2/23/2024, at a depth of 10.00 km and coordinates latitude -38.6955, longitude -15.9053. This integration of heatmap-level spatial context with event-level precision is one of the toolkit's most thoughtful design decisions: users can identify a region of elevated seismic activity in the heatmap, then click individual points within that region to understand exactly which events are driving the heat signature. The Tristan da Cunha cluster visible in the lower center of Image 5 — a tight group of red dots surrounded by a green-to-yellow heat envelope — is a geologically interesting case, as Tristan da Cunha sits atop a hotspot in the middle of the South Atlantic, far from any major plate boundary, making it one of the world's most remote and geologically distinctive seismic zones.

---

## **Geographic Findings: What the Maps Reveal**

Taken together, the two toolkits make several significant patterns in global seismicity immediately visible to any user, regardless of their scientific background.

The Ring of Fire dominates both visualizations. The horseshoe-shaped band of tectonic plate boundaries encircling the Pacific Ocean — from the southern tip of South America up through Central America, the western United States, Alaska, the Aleutian chain, Japan, the Philippines, and Indonesia — accounts for the majority of the world's seismic activity and is unmistakably the brightest and densest feature on both maps. The western coast of South America in particular, where the Nazca Plate subducts beneath the South American Plate, shows a consistent chain of red and orange markers in the Visualization Toolkit and a sustained red heat signature in the Heatmap Toolkit.

The Mediterranean and Middle East seismic zone — encompassing Turkey, Greece, Italy, Iran, and Afghanistan — shows moderate but geographically broad activity in both toolkits, consistent with the complex multi-plate collision dynamics of the Eurasian, African, and Arabian plates in this region.

Mid-ocean ridge activity, while producing generally lower-magnitude events than subduction zones, is visible as scattered isolated clusters in the Atlantic and Indian Oceans — most clearly in the Heatmap Toolkit, where even modest event concentrations register as distinct heat signatures against the low-activity ocean interiors.

The continental interiors of Africa, Australia, and most of Asia appear almost entirely seismically quiet in both visualizations — a direct confirmation of the geologic stability of ancient cratonic landmasses far from active plate boundaries.

---

## **Access and Technical Requirements**

Both toolkits are delivered as self-contained HTML applications. To access them, either click the provided link or download the project files and open `index.html` in any modern web browser. The `/static` folder and all of its contents — including the JavaScript source files, CSS stylesheets, and configuration files — must be present in the same directory as `index.html` for the toolkits to load correctly. Seismic data is fetched automatically from the USGS GeoJSON live feed at launch, ensuring that every session reflects the most current available earthquake data. No installation, server environment, or internet connection beyond initial data fetch is required.

----

### **Copyright**

Nicholas J. George © 2023. All Rights Reserved.
