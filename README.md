# Documentation
- English (Translation made by ChatGPT.)
- Português: [README-BR](/doc/README-BR.md)



# License
- English: [LICENSE](/doc/LICENSE)
- Português: [LICENSE-BR](/doc/LICENSE-BR.txt)



# Getting to Know PASU
Welcome, my friend!
You’re getting first-hand access to PASU and are probably wondering:

## What is PASU?
The **User Service and Support Portal (PASU)** is a simple ticketing system, built with a lot of effort, care, creativity… and a bit of improvisation for ARSP.
Or rather, as Ariane says:
> It’s not a workaround — it’s a technical resource.



# How It Works
As usual, financial limitations shaped PASU into what it is today: a Espírito Santo–style solution that honors its roots and works based on:
> Do the work and trust it will hold.

What does that mean? Basically, we cross our fingers and hope that neither Google nor Atlassian changes anything important that might break the system.

## Flow
Google Forms → Google Sheets → Email/Trello → Google Sheets

## Steps
* The user opens a ticket through **Google Forms**
* The submission fills out the **Google Sheets**
* An email with the information is sent to support
* The same information is sent to **Trello**, becoming cards
* Updates made to the cards are recorded in **Google Sheets**

## Notifications
Users receive emails whenever a card has a **status change**.
The cool part is that when a ticket is completed, the email includes an extra button that leads to a feedback form.

### But how does it work?
All PASU automation works the same way: it runs through **Google Apps Script triggers**.
At first, I tried using Trello’s webhook, but it didn’t work very well.

#### Important
**NEVER** configure the main update trigger with **less than 5 minutes**.
Trello tends to interpret these calls as spam, which can cause PASU to malfunction.



# Maintenance
The fun part — where you start discovering the improvised solutions!

## Changes
New columns in Google Sheets, staff members, form questions, or even Trello lists must be adjusted in the code.
Unless you want to do something very specific, you will mostly only modify the file named **config**.

### Cleanup
I assumed that at some point it would become messy to manage things in Trello, so cards in the **completed** list are archived, and those archived for more than 1 month are **permanently deleted**.
This should help the program last longer, even though it’s technically a “temporary solution.” As the saying goes:

> Nothing lasts longer than a temporary solution.

It also gives users about **2 months** to report any issues.

## Limitations
Well, PASU was built using free tools, so not everything is possible.
**Google** seems to have a limit of around **500 emails per day**. Personally, I think it’s unlikely to reach that limit, but it’s good to know.
Also, even though we have a **Dashboard** option, it doesn’t currently have automation implemented.



# Final Thoughts
It was both fun and challenging to create this, so I hope this project is as useful to you as it has been in my workplace.



# Project Information
* **Version:** 8.1.6
* **Prototype:** 01/15/2026
* **User Testing:** 03/09/2026

## Author
* Alex Fernandes (AlexAkf)
