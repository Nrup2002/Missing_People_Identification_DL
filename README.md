# Missing_People_Identification_DL
[Visit Now](https://missing-people-identification.onrender.com)

#

## System Architecture

We propose a web-based missing person identification system that
utilizes face recognition to identify missing persons in images uploaded
by users. The system is designed to be robust, accurate, and easy to
use, and to protect the privacy of missing persons and their families.

<img src="media/image1.png" style="width:3.05486in;height:2.82014in" />

1.  A user can either upload an existing picture from their gallery or
    capture a new one using the device's camera.

2.  The provided image will be analyzed using a Convolutional Neural
    Network (CNN) algorithm to detect the presence of a missing person's
    face.

3.  If no face is detected, the user will be prompted to upload a
    different image.

4.  Upon successful face detection, the face coordinates will be
    calculated using the Euclidean Distance Algorithm and stored in a
    database.

5.  If the detected face coordinates match any registered face in the
    database, the user will be directed to an Informer Verification
    page.

6.  Otherwise, a message will be displayed indicating no matches were
    found. Following verification, the police station will receive an
    email notification along with the informer's details.

7.  After gathering the information which the local police station has
    gathered via mail. He / She verifies whether the missing persons
    identity already exists in their database.

8.  If the identity matches their existing records in database. They
    will take the necessary action.

## Face Recognition Modules

The system consists of four main modules:

**Admin module:** The admin module is the central hub for managing the
system. Administrators can use the admin module to perform a variety of
tasks, which includes:

-   Add, modify, and delete users.

-   View reports and analytics on system usage.

-   Manage the database of missing persons.

-   Configure the system settings.

An essential part of the system is the admin module, which gives
administrators the ability to verify that the data is correct and
current and that the system is operating efficiently.

**User module:** The interface that users utilize to communicate with
the system is called the user module. Users can use the user module to
perform a variety of tasks, which includes:

-   Upload a photo of person they suspect is missing.

-   Search the database for missing persons records.

-   View information about missing persons.

-   Inform the police about a suspected missing person.

The user module is designed to be easy to use and accessible to
everyone, regardless of their technical expertise.

**Searching module:** The searching module is the engine that powers the
system's search functionality. Users can use the searching module to
search for missing persons in the database by name, age, last known
location, or other criteria. The searching module returns a list of
matching missing persons, along with their information.

The searching module is a critical component of the system, as it allows
users to quickly and easily find missing persons.

**Inform to police module**: The inform to police module allows users to
inform the police about a suspected missing person. When a user clicks
the "Inform to police" button, with the user's location and the photo of
the alleged missing person, the system notifies the closest police
station.

The inform to police module is a valuable tool for helping to find
missing persons quickly and safely. The system works as follows:

1.  Users visit the website and upload a picture of a person they
    believe is missing.

2.  The face recognition module compares the user's image to the images
    in the database.

3.  If the face recognition module finds a match, the system returns the
    matched face in the output and provides the user with the following
    information:

    -   Name of the missing person

    -   Age of the missing person

    -   Last known location of the missing person

4.  The user can then choose to inform the police by clicking the
    "Inform to police" button.

This system has several advantages over traditional methods of missing
person identification. First, it is much faster and more efficient.
Second, it is more accurate, as it is less likely to be fooled by false
positives. Third, it is more accessible, as it can be used by anyone
with an internet connection. Fourth, it protects the privacy of missing
persons and their families by not providing contact information for
missing persons to finders.

## System Requirements

The proposed deep learning-based face recognition system can be
implemented on a variety of hardware and software platforms. To ensure
optimal performance, the following minimum system requirements are
recommended:

Hardware Requirements:

-   Processor: 2.0 GHz or faster

-   Memory: 2 GB RAM or more

-   Storage: 10 GB of available hard disk space

Software Requirements:

-   Operating System: Windows 7 or later, Android 9 or later

-   Web Browser: Firefox, Chrome, Edge, Brave

## Results

The proposed face recognition system was evaluated using a dataset of
200 images of missing persons and 100 images of non-missing persons. The
system correctly detected faces in 98% of the images and matched them
against the database of missing persons with 98% accuracy. The system
also correctly identified missing persons in 80% of cases and informed
the police about potential missing persons in 75% of cases. These
results demonstrate the system's ability to accurately detect and
identify missing persons from images.

The following screenshots illustrate the main features and
functionalities of the proposed face recognition system:

1.  Home page: It provides minimalistic search interface as shown in
    Fig 2. The home page dashboard provides a concise overview of
    missing persons cases. It includes counters for total, tracked, and
    found missing persons. It also displays gender breakdowns. Dashboard
    serves as a valuable tool for understanding the status of missing
    persons cases and identifying trends. Searching option through
    images:

-   Upload an image file.

-   Click on the "Search" button.

-   The system will analyze the image and display similar images or
    information about the image.

<img src="media/image2.png" style="width:3.56667in;height:2.025in" />

2.  Search by Clicked Picture: If the searched person's image matches
    the database, the reported image of the person will pop up for
    verification by the uploader as shown in Fig 3. Click on the image
    if it is correct. If the image is not found in the database, a "No
    matching image found" message will be displayed as shown in Fig 4.
    If image is not clear then it shows “No face detected in uploaded
    image” message will be displayed as shown in Fig 5.

<img src="media/image3.jpeg" style="width:3.49167in;height:6.20833in" />

3.  Match found: If the searched person's image matches the database,
    their name, registration date and place, police station, and region
    of the incident will be displayed as shown in Fig 6. An "Inform
    Police" button will be available for further action.

<img src="media/image6.jpeg" style="width:3.43333in;height:2.125in" />

4.  List of all missing people: The Missing Persons Page offers a
    user-friendly interface for locating missing individuals and
    provides a comprehensive list of missing persons with their names,
    details button, and images as shown in Fig 7.

<img src="media/image7.jpeg" style="width:3.54167in;height:1.975in" />

## Conclusion

Deep learning-based face recognition has the potential to revolutionize
missing person searches by providing a fast and accurate way to identify
missing individuals in images. The main goal of this proposed system is
to find missing people in an area where no camera surveillance is
available using a web application in which common person can upload
picture and inform to police about missing people if found. With this
aim in mind, we used deep learning algorithm like CNN to achieve this
proposed system with 98% accuracy.
