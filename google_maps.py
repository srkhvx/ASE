from flask import Flask, render_template,flash,request,url_for
from flask_googlemaps import GoogleMaps
from flask_googlemaps import Map
import pandas as pd
from Awais import temporary

import pdb

app = Flask(__name__)
# GoogleMaps(app, key="AIzaSyCE_scliuAyRnqaF2OyEMt3_qfWU6IMKPo")
GoogleMaps(app, key="AIzaSyAkSiL0t9O5RtiMycsKX8O8XUyDbH2oZz0")


df = pd.read_csv('KCPD_Crime_Data_2016-18.csv')
# zip = df['zip'].to_list()
lat = df['Latitude'].to_list()
long = df['Longitude'].to_list()
report_no = df['Report_No'].to_list()
address = df['Address'].to_list()
description = df['Description'].to_list()
description_unique = df['Description'].unique().tolist()
year = df['Reported_Date']


# li = [[str(zip[i]),lat[i],long[i]] for i in range(len(df))]
li = [(lat[i],long[i]) for i in range(len(df))]
marker_list = []

for i in range(len(df)):
    temp = {}
    if 'assault' in str(description[i]).lower():
        temp['icon'] = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    else:
        temp['icon'] = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    temp['lat'] = lat[i]
    temp['lng'] = long[i]
    temp['infobox'] = str(address[i])+ ' '+ description[i]
    temp['year'] = str(year[i])
    marker_list.append(temp)

graph_dict = {}

for each in description_unique:
    graph_dict[each] = 0
for each in description:
    graph_dict[each] = graph_dict[each] + 1


#description dataframe

path = 'C:\\Big_Data_Hadoop\\second_increment\\output_files\\'

desc_df = pd.read_csv(path+'crime_count_yearly.csv')
desc_unique = desc_df['Description'].unique().tolist()




def make_my_mape(li):
    mymap = Map(
        identifier="view-side",
        lat=39.034838,
        lng=-94.54507,
        # markers=marker_list
        markers=li)
    return mymap

def make_sndmap():

    sndmap = Map(
        identifier="sndmap",
        lat=37.4419,
        lng=-122.1419,
        markers=[
            {
                'icon': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                'lat': 37.4419,
                'lng': -122.1419,
                'infobox': "<b>Hello World</b>"
            },
            {
                'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                'lat': 37.4300,
                'lng': -122.1400,
                'infobox': "<b>Hello World from other place</b>"
            }
        ]
    )

    return sndmap

def total_sus_vic_arr(proj_list,year):

    df2 = df[df['Reported_Date'].str.contains(year)]
    df2_sus = df2[['Description', 'No_SUS']]
    df2_vic = df2[['Description', 'No_VIC']]
    df2_arr = df2[['Description', 'No_ARR']]

    df2_sus = df2_sus.groupby(["Description"]).sum().sort_values(["No_SUS"], ascending=False).rename(
        columns={"Description": "No_SUS"}).reset_index()
    df2_vic = df2_vic.groupby(["Description"]).sum().sort_values(["No_VIC"], ascending=False).rename(
        columns={"Description": "No_VIC"}).reset_index()
    df2_arr = df2_arr.groupby(["Description"]).sum().sort_values(["No_ARR"], ascending=False).rename(
        columns={"Description": "No_ARR"}).reset_index()
    suspect_dic = df2_sus.set_index('Description')['No_SUS'].to_dict()
    victims_dic = df2_vic.set_index('Description')['No_VIC'].to_dict()
    arrests_dic = df2_arr.set_index('Description')['No_ARR'].to_dict()

    sus = []
    vic = []
    arr = []

    for each in proj_list:
        sus.append(suspect_dic[each])
        vic.append(victims_dic[each])
        arr.append(arrests_dic[each])
    return [sus,vic,arr]

@app.route("/",methods = ['GET','POST'])
def mapview():
    # creating a map in the view
    sus_vic_arr = [[2478,5267,734,784,433],[2478,5267,734,784,433],[2478,5267,734,784,433]]
    marker_show = []
    projectpath = ''
    try:
        if request.method == 'POST':
            projectpath = request.form.getlist('sel_name')
            proj_year = request.form['sel_year']

            if proj_year != -1:
                try:
                    sus_vic_arr = total_sus_vic_arr(projectpath,proj_year)
                except:
                    pass
                for proj in projectpath:

                    temp_list = [e for e in marker_list if str(proj).lower() in str(e['infobox']).lower() and str(proj_year) in str(e['year'])]
                    marker_show = marker_show+temp_list
            # else:
            #     temp_list  = [e for e in marker_list if str(projectpath).lower() in str(e['infobox']).lower()]
    except:
        pass

    mymap = make_my_mape(marker_show)
    sndmap = make_sndmap()



    count_num = 0
    pie_count_list = []
    for proj in projectpath:

        count_num +=int(graph_dict[proj])
        pie_count_list.append(int(graph_dict[proj]))



    try:
        # print(len(temp_list))

        return render_template('home.html', mymap=mymap, sndmap=sndmap, desc_li = description_unique,
                               crime = projectpath,
                               count_num = count_num,
                               year_count = len(marker_show),
                               lab = list(graph_dict.keys()),
                               dat = list(graph_dict.values()),
                               pie_label = projectpath,
                               pie_data = pie_count_list,
                               sus_list = sus_vic_arr)
    except:
        print('errrroooorrrrrrrr')
        return render_template('home.html', mymap=mymap, sndmap=sndmap,desc_li = description_unique,year_count = len(marker_show),
                               lab = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],dat = [12, 19, 3, 5, 2, 3])


@app.route("/analysis", methods = ['GET','POST'])
def analysis():
    analysis_list = []
    try:
        if request.method == 'POST':
            analysis_month =  request.form['analysis_month']
            analysis_offense = request.form['analysis_offense']
            analysis_distance = request.form['analysis_distance']
            analysis_zip = request.form['analysis_zip']

            temp_analysis,analysis_list = temporary(int(analysis_month),int(analysis_offense),int(analysis_distance),int(analysis_zip))
            del analysis_list[0]


    except:
        pass

    mymap = make_my_mape(analysis_list)
    try:
        return render_template('analysis.html',mymap = mymap)
    except:
        return render_template('analysis.html',mymap = mymap)

@app.route("/description", methods = ['GET','POST'])
def description():
    info_df = ''
    desc_temp_year = []
    desc_temp_count = []
    desc_year = ["Africa", "Asia", "Europe", "Latin America", "North America"]

    desc_count = [2478,5267,734,784,433]
    try:
        if request.method == 'POST':
            drop_name =  request.form['sel_name']
            try:

                info_df = desc_df[desc_df['Description']==drop_name]
                desc_temp_year = desc_df['Reported_year'].unique().tolist()
                desc_temp_count = desc_df['num'].unique().tolist()
            except:
                pass
    except:
        pass

    if len(desc_temp_year) != 0:
        desc_year = desc_temp_year
        desc_count = desc_temp_count



    try:
        return render_template('description.html',desc_drop = desc_unique,desc_lab = desc_year,desc_data = desc_count,pr = zip(desc_year,desc_count))
    except:
        return render_template('description.html')




@app.route("/graph", methods = ['GET','POST'])
def index():

    year_graph = {}
    try:
        if request.method == 'POST':
            yr = request.form['sel_yr']
            for each in description_unique:
                year_graph[each] = 0
            for i in range(len(df)):
                try:
                    if str(yr) in str(year[i]):
                        year_graph[description[i]] = year_graph[description[i]]+1
                except:
                    pdb.set_trace()
                    pass


    except:
        pass

    return render_template('index.html',lab = list(graph_dict.keys()),dat = list(graph_dict.values()),
                           yr_lab = list(year_graph.keys()),yr_dat = list(year_graph.values()))

@app.route("/graphs", methods = ['GET','POST'])
def index2():

    year_graph = {}
    try:
        if request.method == 'POST':
            yr = request.form['sel_yr']
            for each in description_unique:
                year_graph[each] = 0
            for i in range(len(df)):
                try:
                    if str(yr) in str(year[i]):
                        year_graph[description[i]] = year_graph[description[i]]+1
                except:
                    pdb.set_trace()
                    pass


    except:
        pass



    return render_template('index2.html',lab = list(graph_dict.keys()),dat = list(graph_dict.values()),
                           yr_lab = list(year_graph.keys()),yr_dat = list(year_graph.values()),yr = yr)


if __name__ == "__main__":

    app.run(debug=True)