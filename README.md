# README

In this document, you will learn about the structure of the website, how it is hosted, how to open the website on a local machine, how to deploy it to Apache, and how modify the sites content!

Website Link : https://websites.umich.edu/~umpolo/

## Getting Started
The project is developed with the React framework. To run the application on a local host, you must first install Node and NPM. Once this is complete, clone this repo. Please make your own Github repo, and commit your changes, as backup and to make it easier for you to pass on the Web Master Role.

Once the repo is on your local machine, navigate to the folder. To open the project, you will first have to install the project dependendincies with the `npm install` command.

Once that is finished, you can run the following command to serve the site on your local network on port 3000 with the `npm start` command. *Make sure your terminal is in the directory with `package.json`

**If using Ubuntu, use `sudo apt update` and `sudo apt install nodejs npm`. Then, verify your installation using `nodejs -v` and `npm -v`. If you get the error `react-scripts: not found`, run `npm install` and then run `npm audit fix`.

And just like that, you have the project up and running on http://localhost:3000/~umpolo. 

## Making a content change
A simple change is anything that has to do with the content on the pages. To change the content, simply navigate to the public directory and data subdirectory. The data is served to the website through the JSON files in this folder. To make a change, simply add/alter/remove  data in the appropriate file. Simply read the first couple of entries to understand how the modifications must be formatted. To upload images for the files (should it be necessary for the section you are modifying), make sure you upload the image into the proper subdirectory within the public directory. Use SVGs for icons and always optimize images (example tools to optimize are imageoptim and svgo).

## Deployment
To deploy the site, use the `npm run build` command to bundle the site. Then, upload the entire contents of the build folder to the private UMpolo sub-directory. This can be done through SFTP using open source software CyberDuck on the Michigan network or VPN. Open a connection to `sftp.web.itd.umich.edu` and use your umich login credentials. Once the connection is established navigate to `/afs/umich.edu/group/soas/umpolo/Public/html/` and overwrite those files with the content in the generated build folder. After this the new website should be live.

** If you get permission denied when trying to overwrite you will need to be added as an owner to the umpolo group in mcommunity. Then follow the instructions on this website: https://teamdynamix.umich.edu/TDClient/30/Portal/KB/ArticleDet?ID=7243. Specifically, the "controlling permission and access" section where you do pts adduser

** Contact previous Web Master to grant you access to Website, and visit https://ifsprovisioning.its.umich.edu and press Request to gain access to AFS home directory (Required for ITS login and SFTP servers). Otherwise, You cannot add changes to the actual website.

Happy Coding! 
