/****************************************************************************
 *
 *  File Name:  earthquakes_heatmap_logic.js
 *
 *  File Description:
 *      This Javascript file contains the function and subroutine calls 
 *      for the html file, index.html. Here is a list of the functions
 *      and subroutines:
 *  
 *      fetch_json_data_from_url_function
 *      return_updated_dropdown_menu_array_function
 * 
 *      add_option_to_dropdown_menu_subroutine
 *      populate_dropdown_menu_with_array_subroutine
 *      populate_dropdown_menus_subroutine
 *      populate_magnitude_dropdown_menu_subroutine
 *      populate_depth_dropdown_menu_subroutine
 * 
 *      display_overlay_layer_subroutine
 *      display_heatmap_subroutine
 *      display_map_markers_subroutine
 * 
 *      change_time_period_subroutine
 *      change_magnitude_subroutine
 *      change_depth_subroutine
 * 
 *      initialize_webpage_subroutine
 *      
 *
 *  Date        Description                             Programmer
 *  ----------  ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

// These variables hold the URLs for the earthquake data sets.
let earthquakes_past_thirty_days_url_string = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

let earthquakes_past_seven_days_url_string = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

let earthquakes_past_day_url_string = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

let earthquakes_past_hour_url_string = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';


// These objects are the three overlay layers: heatmap and earthquakes.
let heatmap_overlay_layer_group
        = L.layerGroup();

let earthquakes_overlay_layer_group
        = L.layerGroup();


// These lines of code declare the four map tile layers: outdoors, grayscale,
// satellite, and dark.
const outdoors_map_tile_layer 
      = L.tileLayer
        (
            'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
            {
                attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                tileSize: 512,
                maxZoom: 18,
                zoomOffset: -1,
                id: 'mapbox/outdoors-v11',
                accessToken: API_KEY
            }
        );

const grayscale_map_tile_layer 
      = L.tileLayer
        (
            'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
            {
                attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                tileSize: 512,
                maxZoom: 18,
                zoomOffset: -1,
                id: 'mapbox/light-v10',
                accessToken: API_KEY
            }
        );

const satellite_map_tile_layer 
      = L.tileLayer
        (
            'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
            {
                attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
                maxZoom: 18,
                id: 'mapbox.satellite',
                accessToken: API_KEY
            }
        );

const dark_map_tile_layer 
      = L.tileLayer 
        (
            'https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
            {
                attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
                maxZoom: 18,
                id: 'dark-v10',
                accessToken: API_KEY
            }
        );


// This Dictionary contains the base map tile layers.
const base_map_tile_layer_dictionary
        = {
            'Grayscale Map': grayscale_map_tile_layer,
            'Outdoors Map': outdoors_map_tile_layer,
            'Satellite Map': satellite_map_tile_layer,
            'Dark Map': dark_map_tile_layer
          };

// This Dictionary contains three map overlay layers: heatmap and earthquakes.
const overlay_layer_group_dictionary 
        = {
                'Heatmap': heatmap_overlay_layer_group,
                'Earthquakes': earthquakes_overlay_layer_group
          };

// This map object is the current map and initially displays the grayscale map with the 
// two overlay layers.
let current_map_object 
        = L.map
            ('mapid', 
                {
                    center: [30.0, 0.0],
                    zoom: 2.5,
                    layers: [grayscale_map_tile_layer,
                             heatmap_overlay_layer_group,
                             earthquakes_overlay_layer_group]
                }
            );

// This control layer displays the map and overlay options.
L.control
    .layers
    (   
        base_map_tile_layer_dictionary, 
        overlay_layer_group_dictionary, 
        {collapsed: true}
    )
    .addTo(current_map_object);


// These dictionaries hold the blueprint and current values for the dropdown menus.
const time_period_dropdown_menu_options_dictionary
        = {'Past 30 Days': earthquakes_past_thirty_days_url_string, 
           'Past 7 Days': earthquakes_past_seven_days_url_string, 
           'Past Day': earthquakes_past_day_url_string, 
           'Past Hour': earthquakes_past_hour_url_string};

const magnitude_dropdown_menu_options_dictionary
        = {'Magnitude': [-20.0, 20.0],
           '<2.5': [-20.0, 2.4], 
           '2.5-5.4': [2.5, 5.4], 
           '5.5-6.0': [5.5, 6.0], 
           '7.0-7.9': [7.0, 7.9], 
           '8.0+': [8.0, 20.0]};

const depthdropdown_menu_options_dictionary
        = {'Depth': [-10.0, 1000.0],
           '-10-10': [-10.0, 9.9], 
           '10-30': [10.0, 29.9], 
           '30-50': [30.0, 49.9], 
           '50-70': [50.0, 69.9], 
           '70-90': [70.0, 89.9], 
           '90+': [90.0, 1000.0]};

let current_dropdown_menu_dictionary
        = {'period': 'Past 30 Days',
           'magnitude': 'Magnitude',
           'depth': 'Depth'};


/****************************************************************************
 *
 *  Function Name:  fetch_json_data_from_url_function
 *
 *  Function Description:  
 *      This function is the first stage for retrieving the aviation 
 *      accidents data set from the specified URL.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          url_string
 *                          This parameter is the URL for the source data.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

async function fetch_json_data_from_url_function(url_string) 
{
    var data_d3_json_object = null;
  
    try 
    {
        data_d3_json_object = await d3.json(url_string);
    }
    catch (error) 
    {
        console.error(error);
    }
 
    return data_d3_json_object;
} // This right brace ends the block for the function, 
// fetch_json_data_from_url_function.


/****************************************************************************
 *
 *  Function Name:  return_updated_dropdown_menu_array_function
 *
 *  Function Description:  
 *      This function returns an updated array of dropdown menu options
 *      based on the current criteria.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  Dictionary
 *          earthquake_features_dictionary_array
 *                          This parameter is the current earthquake data
 *                          set.
 *  Dictionary
 *          dropdown_menu_options_dictionary
 *                          This parameter is the current dropdown menu's
 *                          full options.
 *  String
 *          dropdown_menu_id_string
 *                          This parameter is the ID for the current
 *                          dropdown menu.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function return_updated_dropdown_menu_array_function
            (earthquake_features_dictionary_array,
             dropdown_menu_options_dictionary,
             dropdown_menu_id_string = 'selectMagnitude')
{
    var dropdown_menu_string_array = [];
    
    var condition_float;

    for (var key in dropdown_menu_options_dictionary) 
    {
        if (key != Object.keys(dropdown_menu_options_dictionary).shift())
        {
            for (var i = 0; i < earthquake_features_dictionary_array.length; i++)
            {
                if (dropdown_menu_id_string === 'selectMagnitude')
                {
                    condition_float
                        = Number(earthquake_features_dictionary_array[i].properties.mag).toFixed(1);
                }
                else
                {
                    condition_float
                        = Number(earthquake_features_dictionary_array[i].geometry.coordinates[2]).toFixed(1);
                }

                if (condition_float >= dropdown_menu_options_dictionary[key][0]
                    && condition_float <= dropdown_menu_options_dictionary[key][1])
                {
                    dropdown_menu_string_array.push(key);
            
                    break;
                }
            }
        }
    }

    return dropdown_menu_string_array;
} // This right brace ends the block for the function, 
// return_updated_dropdown_menu_array_function.


/****************************************************************************
 *
 *  Subroutine Name:  add_option_to_dropdown_menu_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine adds one option to a dropdown menu.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          select_element_object
 *                          This parameter is the dropdown menu object.
 *  String
 *          option_string
 *                          This parameter is the new option for the
 *                          dropdownn menu.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function add_option_to_dropdown_menu_subroutine
            (select_element_object,
             option_string)
{
    var document_element_object = document.createElement('option');


    document_element_object.textContent = option_string;

    document_element_object.value = option_string;

    select_element_object.appendChild(document_element_object);
} // This right brace ends the block for the subroutine, 
// add_option_to_dropdown_menu_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  populate_dropdown_menu_with_array_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine populates a dropdown menu with an Array.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          dropdown_menu_id_string
 *                          This parameter is the dropdown menu ID.
 *  String
 *          dropdown_menu_string_array
 *                          This parameter is an Array for the dropdown
 *                          menu.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function populate_dropdown_menu_with_array_subroutine
            (dropdown_menu_id_string,
             dropdown_menu_string_array)
{
    var select_element_object = document.getElementById(dropdown_menu_id_string);

    var last_element_index_integer = select_element_object.options.length - 1;


    for (var i = last_element_index_integer; i > 0; i--) 
    {
        select_element_object.remove(i);
    }

    for (var j = 0; j < dropdown_menu_string_array.length; j++) 
    {
        add_option_to_dropdown_menu_subroutine
            (select_element_object,
             dropdown_menu_string_array[j]);
    }
} // This right brace ends the block for the subroutine, 
// populate_dropdown_menu_with_array_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  populate_dropdown_menus_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine initially populates all the dropdown menus.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function populate_dropdown_menus_subroutine()
{
    var time_period_dropdown_array
            = Object
                .keys (time_period_dropdown_menu_options_dictionary)
                .slice (1);


    populate_dropdown_menu_with_array_subroutine
        ('selectTimePeriod',
         time_period_dropdown_array);

    current_dropdown_menu_dictionary['period'] = 'Past 30 Days';

    populate_magnitude_dropdown_menu_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']]);

    populate_depth_dropdown_menu_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']]);
} // This right brace ends the block for the subroutine, 
// populate_dropdown_menus_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  populate_magnitude_dropdown_menu_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine populates the magnitude dropdown menu.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          url_string
 *                          This parameter is the current earthquake URL.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function populate_magnitude_dropdown_menu_subroutine(url_string)
{
    fetch_json_data_from_url_function
        (url_string)
            .then
            (
                (earthquakes_geojson_dictionary => 
                    {
                        var currentearthquake_features_dictionary_array
                                = earthquakes_geojson_dictionary.features;

                        var magnitude_dropdown_menu_string_array
                                = return_updated_dropdown_menu_array_function
                                    (currentearthquake_features_dictionary_array,
                                     magnitude_dropdown_menu_options_dictionary);
                        
                        populate_dropdown_menu_with_array_subroutine
                            ('selectMagnitude',
                             magnitude_dropdown_menu_string_array);
                    }
                )
            );
} // This right brace ends the block for the subroutine, 
// populate_magnitude_dropdown_menu_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  populate_depth_dropdown_menu_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine populates the depth dropdown menu.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          url_string
 *                          This parameter is the current earthquake URL.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function populate_depth_dropdown_menu_subroutine(url_string)
{
    fetch_json_data_from_url_function
        (url_string)
            .then
            (
                (earthquakes_geojson_dictionary => 
                    {
                        var currentearthquake_features_dictionary_array
                                = earthquakes_geojson_dictionary.features;

                        var depth_dropdown_menu_string_array
                                = return_updated_dropdown_menu_array_function
                                    (currentearthquake_features_dictionary_array,
                                     depthdropdown_menu_options_dictionary,
                                     'selectDepth');

                        populate_dropdown_menu_with_array_subroutine
                            ('selectDepth',
                             depth_dropdown_menu_string_array);
                    }
                )
            );
}  // This right brace ends the block for the subroutine, 
// populate_depth_dropdown_menu_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  display_overlay_layer_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine checks whether the overlay layer is currently
 *      displayed and updates the overlay layer accordingly.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  Overlay Layer Group
 *          overlay_layer_group
 *                          This parameter is the current overlay layer group.
 *  Boolean
 *          layer_exists_boolean
 *                          This parameter indicates whether the overlay layer
 *                          is currently displayed or not.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function display_overlay_layer_subroutine
            (overlay_layer_group,
             layer_exists_boolean)
{
    if (layer_exists_boolean == false)
    {
        current_map_object.removeLayer(overlay_layer_group);
    }
    else
    {
        overlay_layer_group.addTo(current_map_object); 
    }
} // This right brace ends the block for the subroutine, 
// display_overlay_layer_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  display_heatmap_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine displays the heatmap.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          url_string
 *                          This parameter is the current earthquake URL.
 *  String
 *          magnitude_dictionary_key_string
 *                          This parameter is the identifier for the 
 *                          current magnitude dropdown option.
 *  String
 *          depth_dictionary_key_string
 *                          This parameter is the identifier for the 
 *                          current depth dropdown option.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function display_heatmap_subroutine
            (url_string,
             magnitude_dictionary_key_string,
             depth_dictionary_key_string)
{
    var layer_exists_boolean = true;

    if (current_map_object.hasLayer(heatmap_overlay_layer_group) == false)
    {
        layer_exists_boolean = false;
    }

    heatmap_overlay_layer_group.clearLayers();

    heatmap_overlay_layer_group.addTo(current_map_object);

    fetch_json_data_from_url_function 
        (url_string)
            .then
            (
                (earthquakes_geojson_dictionary => 
                    {
                        var currentearthquake_features_dictionary_array
                                = earthquakes_geojson_dictionary
                                    .features
                                    .filter
                                        (features_key =>
                                            (Number(features_key.properties.mag).toFixed(1) 
                                                >= magnitude_dropdown_menu_options_dictionary
                                                    [magnitude_dictionary_key_string][0]
                                             && Number(features_key.properties.mag).toFixed(1) 
                                                <= magnitude_dropdown_menu_options_dictionary
                                                    [magnitude_dictionary_key_string][1]))
                                    .filter
                                        (features_key =>
                                            (Number(features_key.geometry.coordinates[2]).toFixed(1) 
                                                >= depthdropdown_menu_options_dictionary
                                                    [depth_dictionary_key_string][0]
                                             && Number(features_key.geometry.coordinates[2]).toFixed(1) 
                                                <= depthdropdown_menu_options_dictionary
                                                    [depth_dictionary_key_string][1]));

                        var heat_location_array = [];
                    
                        for (var i = 0; 
                             i < currentearthquake_features_dictionary_array.length; 
                             i++)
                        {
                            heat_location_array
                                .push
                                (
                                    [currentearthquake_features_dictionary_array[i].geometry.coordinates[1],
                                     currentearthquake_features_dictionary_array[i].geometry.coordinates[0],
                                     (1 + currentearthquake_features_dictionary_array[i].properties.mag) * 4.0
                                    ]
                                )
                        }

                        L.heatLayer
                            (heat_location_array, 
                                {
                                    minOpacity: 0.2,
                                    radius: 40,
                                    blur: 40,
                                    gradient: {0.15: 'blue', 
                                               0.25: 'green', 
                                               0.4: 'orange', 
                                               0.5: 'orangered', 
                                               0.65: 'red', 
                                               1.0: 'darkred'}
                                }
                            ).addTo(heatmap_overlay_layer_group);
                             
                        display_overlay_layer_subroutine
                            (heatmap_overlay_layer_group,
                             layer_exists_boolean);
                        
                    }
                )
            );
} // This right brace ends the block for the subroutine, 
// display_heatmap_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  display_map_markers_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine checks displays the earthquake markers.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          url_string
 *                          This parameter is the current earthquake URL.
 *  String
 *          magnitude_dictionary_key_string
 *                          This parameter is the identifier for the 
 *                          current magnitude dropdown option.
 *  String
 *          depth_dictionary_key_string
 *                          This parameter is the identifier for the 
 *                          current depth dropdown option.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function display_map_markers_subroutine
            (url_string,
             magnitude_dictionary_key_string,
             depth_dictionary_key_string)
{
    var layer_exists_boolean
            = true;

    if (current_map_object.hasLayer(earthquakes_overlay_layer_group) == false)
    {
        layer_exists_boolean = false;
    }

    earthquakes_overlay_layer_group.clearLayers();

    earthquakes_overlay_layer_group.addTo(current_map_object);

    fetch_json_data_from_url_function 
        (url_string)
            .then
            (
                (earthquakes_geojson_dictionary => 
                    {
                        var currentearthquake_features_dictionary_array
                                = earthquakes_geojson_dictionary
                                    .features
                                    .filter
                                        (features_key =>
                                            (Number(features_key.properties.mag).toFixed(1) 
                                                >= magnitude_dropdown_menu_options_dictionary
                                                    [magnitude_dictionary_key_string][0]
                                             && Number(features_key.properties.mag).toFixed(1) 
                                                <= magnitude_dropdown_menu_options_dictionary
                                                    [magnitude_dictionary_key_string][1]))
                                    .filter
                                        (features_key =>
                                            (Number(features_key.geometry.coordinates[2]).toFixed(1) 
                                                >= depthdropdown_menu_options_dictionary
                                                    [depth_dictionary_key_string][0]
                                             && Number(features_key.geometry.coordinates[2]).toFixed(1) 
                                                <= depthdropdown_menu_options_dictionary
                                                    [depth_dictionary_key_string][1]));

                        for (var i = 0; 
                             i < currentearthquake_features_dictionary_array.length; 
                             i++)
                        {   
                            L.circle
                            (
                                ([currentearthquake_features_dictionary_array[i].geometry.coordinates[1],
                                  currentearthquake_features_dictionary_array[i].geometry.coordinates[0]]), 
                                 {
                                    radius: 50000.0,
                                    fillColor: 'maroon',
                                    fillOpacity: 1.0,
                                    color: 'black',
                                    stroke: true,
                                    weight: 0.5
                                }
                            )
                            .bindPopup
                            (
                                `<div class="map-popup"><a href="${currentearthquake_features_dictionary_array[i].properties.url}">
                                    ${currentearthquake_features_dictionary_array[i].properties.title}</a></div><br>
                                <div class="map-popup-exp">
                                <span>Location: </span> ${currentearthquake_features_dictionary_array[i].properties.place} <br>
                                <span>Date: </span> ${new Intl.DateTimeFormat().format(new Date(currentearthquake_features_dictionary_array[i].properties.time))} <br>
                                <span>Magnitude: </span> ${Number(currentearthquake_features_dictionary_array[i].properties.mag).toFixed(2)} <br>
                                <span>Depth: </span> ${Number(currentearthquake_features_dictionary_array[i].geometry.coordinates[2]).toFixed(2)} km <br>
                                <span>Latitude: </span> ${Number(currentearthquake_features_dictionary_array[i].geometry.coordinates[1]).toFixed(4)} <br>
                                <span>Longitude: </span> ${Number(currentearthquake_features_dictionary_array[i].geometry.coordinates[0]).toFixed(4)}
                                </div>`
                            )
                            .addTo(earthquakes_overlay_layer_group);
                             
                            display_overlay_layer_subroutine
                                (earthquakes_overlay_layer_group,
                                 layer_exists_boolean);
                        }
                    }
                )
            );
} // This right brace ends the block for the subroutine, 
// display_map_markers_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  change_time_period_subroutine
 *
 *  Subroutine Description:  
 *      This function is the callback for changes in the time period 
 *      dropdown menu.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          dropdown_id_string
 *                          This parameter is the ID for the current
 *                          dropdown menu.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function change_time_period_subroutine(dropdown_id_string)
{
    current_dropdown_menu_dictionary['period'] = dropdown_id_string;

    current_dropdown_menu_dictionary['magnitude'] = 'Magnitude';

    current_dropdown_menu_dictionary['depth'] = 'Depth';
        
    populate_magnitude_dropdown_menu_subroutine
        (time_period_dropdown_menu_options_dictionary[dropdown_id_string]);

    populate_depth_dropdown_menu_subroutine
        (time_period_dropdown_menu_options_dictionary[dropdown_id_string]);

    display_heatmap_subroutine
        (time_period_dropdown_menu_options_dictionary
            [dropdown_id_string],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth']);

    display_map_markers_subroutine
        (time_period_dropdown_menu_options_dictionary
            [dropdown_id_string],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth']);
} // This right brace ends the block for the subroutine, 
// change_time_period_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  change_magnitude_subroutine
 *
 *  Subroutine Description:  
 *      This function is the callback for changes in the magnitude
 *      dropdown menu.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          dropdown_id_string
 *                          This parameter is the ID for the current
 *                          dropdown menu.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function change_magnitude_subroutine
            (dropdown_id_string)
{   
    current_dropdown_menu_dictionary['magnitude'] = dropdown_id_string;


    display_heatmap_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth']);
    
    display_map_markers_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth']);
} // This right brace ends the block for the subroutine, 
// change_magnitude_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  change_depth_subroutine
 *
 *  Subroutine Description:  
 *      This function is the callback for changes in the depth dropdown
 *      menu.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          dropdown_id_string
 *                          This parameter is the ID for the current
 *                          dropdown menu.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function change_depth_subroutine(dropdown_id_string)
{
    current_dropdown_menu_dictionary['depth'] = dropdown_id_string;

    
    display_heatmap_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth']);

    display_map_markers_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth']);
} // This right brace ends the block for the subroutine, 
// change_depth_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  initialize_webpage_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine initializes the Aviation Accidents Visualization
 *      Toolkit by populating the drop down menus and setting up the
 *      legend, dropdown menus, and map layers.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function initialize_webpage_subroutine() 
{
    populate_dropdown_menus_subroutine();

    display_heatmap_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth']);

    display_map_markers_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth']);
} // This right brace ends the block for the subroutine, 
// initialize_webpage_subroutine.


initialize_webpage_subroutine();