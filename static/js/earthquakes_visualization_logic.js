/****************************************************************************
 *
 *  File Name:  earthquakes_visualization_logic.js
 *
 *  File Description:
 *      This Javascript file contains the function and subroutine calls 
 *      for the html file, index.html. Here is a list of the functions
 *      and subroutines:
 *  
 *      fetch_json_data_from_url_function
 *      choose_color_from_depth_function
 *      set_marker_size_from_magitude_function
 *      return_updated_dropdown_menu_array_function
 * 
 *      add_option_to_dropdown_menu_subroutine
 *      populate_dropdown_menu_with_array_subroutine
 *      populate_dropdown_menus_subroutine
 *      populate_magnitude_dropdown_menu_subroutine
 *      populate_depth_dropdown_menu_subroutine
 * 
 *      display_legend_subroutine
 *      display_overlay_layer_subroutine
 *      display_tectonic_plates_subroutine
 *      display_orogens_subroutine
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

// These variables hold the URLs for the earthquake, tectonic plate, and 
// orogens data sets.
let earthquakes_past_thirty_days_url_string = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

let earthquakes_past_seven_days_url_string = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

let earthquakes_past_day_url_string = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

let earthquakes_past_hour_url_string = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';

let tectonic_plates_url_string = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';

let orogens_url_string = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_orogens.json';


// These objects are the three overlay layers: earthquakes, tectonic plates,
// and orogens.
let earthquakes_overlay_layer_group = L.layerGroup();

let tectonic_plates_overlay_layer_group = L.layerGroup();

let orogens_overlay_layer_group = L.layerGroup();


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
            'Outdoors Map': outdoors_map_tile_layer,
            'Grayscale Map': grayscale_map_tile_layer,
            'Satellite Map': satellite_map_tile_layer,
            'Dark Map': dark_map_tile_layer
          };

// This Dictionary contains three map overlay layers: earthquakes, tectonic plates,
// and orogens.
const overlay_layer_group_dictionary 
        = {
              'Earthquakes': earthquakes_overlay_layer_group,
              'Tectonic Plates': tectonic_plates_overlay_layer_group,
              'Orogens': orogens_overlay_layer_group
          };

// This map object is the current map and initially displays the dark map with the 
// three overlay layers.
let current_map_object 
        = L.map
            ('mapid', 
                {
                    center: [30.0, 0.0],
                    zoom: 2.5,
                    layers: [outdoors_map_tile_layer,
                             earthquakes_overlay_layer_group,
                             tectonic_plates_overlay_layer_group,
                             orogens_overlay_layer_group]
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


// This control layer is the legend.
let legend_control_object = L.control({position: 'topright'});


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

const depth_dropdown_menu_options_dictionary
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


// This Array includes the depth limits for color assignment.
const depth_range_float_array = [-10.0, 10.0, 30.0, 50.0, 70.0, 90.0];


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
 *  Function Name:  choose_color_from_depth_function
 *
 *  Function Description:  
 *      This function chooses a color based on the depth of the earthquake.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  Float
 *          depth_float
 *                          This parameter is the depth of the earthquake.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function choose_color_from_depth_function(depth_float) 
{
    if (depth_float >= depth_range_float_array[5])
    {
        return 'red';
    }
    else if (depth_float >= depth_range_float_array[4])
    {
        return 'orangered';
    }
    else if (depth_float >= depth_range_float_array[3])
    {
        return 'orange';
    }
    else if (depth_float >= depth_range_float_array[2])
    {
        return 'gold';
    }
    else if (depth_float >= depth_range_float_array[1])
    {
        return 'yellow';
    }
    else
    {
        return 'lightgreen';
    }
} // This right brace ends the block for the function, 
// choose_color_from_depth_function.


/****************************************************************************
 *
 *  Function Name:  set_marker_size_from_magitude_function
 *
 *  Function Description:  
 *      This function chooses a color based on the magnitude of the 
 *      earthquake.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  Float
 *          magnitude_float
 *                          This parameter is the magnitude of the 
 *                          earthquake.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function set_marker_size_from_magitude_function(magnitude_float) 
{
    return Math.sqrt(Math.abs(magnitude_float))*70000.0;
} // This right brace ends the block for the function, 
// set_marker_size_from_magitude_function.


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
                        = Number(earthquake_features_dictionary_array[i].properties.mag)
                            .toFixed(1);
                }
                else
                {
                    condition_float
                        = Number(earthquake_features_dictionary_array[i].geometry.coordinates[2])
                            .toFixed(1);
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
 *          local_url_string
 *                          This parameter is the current earthquake URL.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function populate_magnitude_dropdown_menu_subroutine(local_url_string)
{
    fetch_json_data_from_url_function
        (local_url_string)
            .then
            (
                (earthquakes_geojson_dictionary => 
                    {
                        var current_earthquake_features_dictionary_array
                                = earthquakes_geojson_dictionary.features;

                        var magnitude_dropdown_menu_string_array
                                = return_updated_dropdown_menu_array_function
                                    (current_earthquake_features_dictionary_array,
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
 *          local_url_string
 *                          This parameter is the current earthquake URL.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     Nicholas J. George
 *
 ****************************************************************************/

function populate_depth_dropdown_menu_subroutine(local_url_string)
{
    fetch_json_data_from_url_function
        (local_url_string)
            .then
            (
                (earthquakes_geojson_dictionary => 
                    {
                        var current_earthquake_features_dictionary_array
                                = earthquakes_geojson_dictionary.features;

                        var depth_dropdown_menu_string_array
                                = return_updated_dropdown_menu_array_function
                                    (current_earthquake_features_dictionary_array,
                                     depth_dropdown_menu_options_dictionary,
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
 *  Subroutine Name:  display_tectonic_plates_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine displays the tectonic plate boundaries.
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

function display_tectonic_plates_subroutine()
{
    var layer_exists_boolean = true;


    if (current_map_object.hasLayer(tectonic_plates_overlay_layer_group) == false)
    {
        layer_exists_boolean = false;
    }

    tectonic_plates_overlay_layer_group.clearLayers();

    tectonic_plates_overlay_layer_group.addTo(current_map_object);

    fetch_json_data_from_url_function 
        (tectonic_plates_url_string)
            .then
            (
                (tectonic_geojson_dictionary => 
                    {
                        L.geoJSON
                        (
                            tectonic_geojson_dictionary.features, 
                            {style: 
                                {color: 'firebrick',
                                 weight: 4.0}
                            }
                        )
                        .addTo(tectonic_plates_overlay_layer_group);

                        display_overlay_layer_subroutine
                            (tectonic_plates_overlay_layer_group,
                             layer_exists_boolean);
                    }
                )
            );
} // This right brace ends the block for the subroutine, 
// display_tectonic_plates_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  display_orogens_subroutine
 *  Subroutine Description:  
 *      This subroutine displays the orogens.
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

function display_orogens_subroutine()
{
    var layer_exists_boolean = true;


    if (current_map_object.hasLayer(orogens_overlay_layer_group) == false)
    {
        layer_exists_boolean = false;
    }

    orogens_overlay_layer_group.clearLayers();

    orogens_overlay_layer_group.addTo(current_map_object);

    fetch_json_data_from_url_function 
        (orogens_url_string)
            .then
            (
                (orogens_geojson_dictionary => 
                    {
                        L.geoJSON
                        (
                            orogens_geojson_dictionary.features, 
                            {style: 
                                {color: 'steelblue',
                                 weight: 2.0}
                            }
                        )
                        .addTo(orogens_overlay_layer_group);

                        display_overlay_layer_subroutine
                            (orogens_overlay_layer_group,
                             layer_exists_boolean);
                    }
                )
            );
} // This right brace ends the block for the subroutine, 
// display_orogens_subroutine.


/****************************************************************************
 *
 *  Subroutine Name:  display_map_markers_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine displays the earthquake markers.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          local_url_string
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
            (local_url_string,
             magnitude_dictionary_key_string,
             depth_dictionary_key_string)
{
    var layer_exists_boolean = true;


    if (current_map_object.hasLayer(earthquakes_overlay_layer_group) == false)
    {
        layer_exists_boolean = false;
    }

    earthquakes_overlay_layer_group.clearLayers();

    earthquakes_overlay_layer_group.addTo(current_map_object);

    fetch_json_data_from_url_function 
        (local_url_string)
            .then
            (
                (earthquakes_geojson_dictionary => 
                    {
                        var current_earthquake_features_dictionary_array
                                = earthquakes_geojson_dictionary
                                    .features
                                    .filter
                                        (featuresKey =>
                                            (Number(featuresKey.properties.mag).toFixed(1) 
                                                >= magnitude_dropdown_menu_options_dictionary[magnitude_dictionary_key_string][0]
                                             && Number(featuresKey.properties.mag).toFixed(1) 
                                                <= magnitude_dropdown_menu_options_dictionary[magnitude_dictionary_key_string][1]))
                                    .filter
                                        (featuresKey =>
                                            (Number(featuresKey.geometry.coordinates[2]).toFixed(1) 
                                                >= depth_dropdown_menu_options_dictionary[depth_dictionary_key_string][0]
                                             && Number(featuresKey.geometry.coordinates[2]).toFixed(1) 
                                                <= depth_dropdown_menu_options_dictionary[depth_dictionary_key_string][1]));

                        for (var i = 0; 
                             i < current_earthquake_features_dictionary_array.length; 
                             i++)
                        {   
                            L.circle
                            (
                                ([current_earthquake_features_dictionary_array[i].geometry.coordinates[1],
                                  current_earthquake_features_dictionary_array[i].geometry.coordinates[0]]), 
                                 {
                                    radius: set_marker_size_from_magitude_function
                                                (current_earthquake_features_dictionary_array[i].properties.mag),
                                    fillColor: choose_color_from_depth_function
                                                (current_earthquake_features_dictionary_array[i].geometry.coordinates[2]),
                                    fillOpacity: 0.7,
                                    color: 'black',
                                    stroke: true,
                                    weight: 0.5
                                }
                            )
                            .bindPopup
                            (
                                `<div class="map-popup"><a href="${current_earthquake_features_dictionary_array[i].properties.url}">
                                    ${current_earthquake_features_dictionary_array[i].properties.title}</a></div><br>
                                <div class="map-popup-exp">
                                <span>Location: </span> ${current_earthquake_features_dictionary_array[i].properties.place} <br>
                                <span>Date: </span> ${new Intl.DateTimeFormat().format(new Date(current_earthquake_features_dictionary_array[i].properties.time))} <br>
                                <span>Magnitude: </span> ${Number(current_earthquake_features_dictionary_array[i].properties.mag).toFixed(2)} <br>
                                <span>Depth: </span> ${Number(current_earthquake_features_dictionary_array[i].geometry.coordinates[2]).toFixed(2)} km <br>
                                <span>Latitude: </span> ${Number(current_earthquake_features_dictionary_array[i].geometry.coordinates[1]).toFixed(4)} <br>
                                <span>Longitude: </span> ${Number(current_earthquake_features_dictionary_array[i].geometry.coordinates[0]).toFixed(4)}
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
 *  Subroutine Name:  display_legend_subroutine
 *
 *  Subroutine Description:  
 *      This subroutine displays the legend for the base map.
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

function display_legend_subroutine() 
{
    legend_control_object
        .onAdd 
            = function() 
              {
                    var div_dom_utility_object
                            = L.DomUtil.create('div', 'legend');


                    div_dom_utility_object.innerHTML 
                        = '<p>Depth</p>' 
                          + depth_range_float_array.map
                                (function(elementFloat, indexInteger) 
                                 {
                                    return '<span style = "background:' 
                                           + choose_color_from_depth_function(elementFloat + 1.0) 
                                           + '">&nbsp &nbsp &nbsp &nbsp</span> ' 
                                           + elementFloat 
                                           + (depth_range_float_array[indexInteger + 1] 
                                              ? ' &ndash; ' + depth_range_float_array[indexInteger + 1] + '<br>' 
                                              : '+');
                                 }
                                ).join('');
  
                    return div_dom_utility_object;
              };

    let legendButtonObject 
            = L.easyButton
                (
                    {
                        position: 'topright',
                        states: 
                            [
                                {
                                    stateName: 'show-legend',
                                    icon: '<img class = "button-keys" src = "https://upload.wikimedia.org/wikipedia/commons/1/11/Key.svg" height = "30px">',
                                    onClick: 
                                        function(control) 
                                        {
                                            legend_control_object.addTo(current_map_object);

                                            control.state('hide-legend');
                                        }
                                }, 
                                {
                                    stateName: 'hide-legend',
                                    icon: '<img class = "button-keys" src = "https://upload.wikimedia.org/wikipedia/commons/1/11/Key.svg" height = "30px">',
                                    onClick: 
                                        function(control) 
                                        {
                                            current_map_object.removeControl(legend_control_object);

                                            control.state('show-legend');
                                        }
                                }
                            ]
                    }
                ).addTo(current_map_object);

    let button_element_object = legendButtonObject._container.firstChild;

    button_element_object.id = 'legend-button';
} // This right brace ends the block for the subroutine, 
// display_legend_subroutine.


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

    display_map_markers_subroutine
        (time_period_dropdown_menu_options_dictionary[dropdown_id_string],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth'])
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

function change_magnitude_subroutine(dropdown_id_string)
{   
    current_dropdown_menu_dictionary['magnitude'] = dropdown_id_string;

    display_map_markers_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth'])
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

    display_map_markers_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth'])
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

    display_legend_subroutine();

    display_tectonic_plates_subroutine();

    display_orogens_subroutine();

    display_map_markers_subroutine
        (time_period_dropdown_menu_options_dictionary
            [current_dropdown_menu_dictionary['period']],
         current_dropdown_menu_dictionary['magnitude'],
         current_dropdown_menu_dictionary['depth']);

} // This right brace ends the block for the subroutine, 
// initialize_webpage_subroutine.


initialize_webpage_subroutine();