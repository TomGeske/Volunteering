# Volunteering
Create a platform to connect volunteers

# Tools
1. Visual Studio Code (https://code.visualstudio.com/download)
2. Node (https://nodejs.org/en/download/)

# Installation
1. Clone the repo.
2. Ensure your client IP is white listed in Cosmos DB Firewall [Doc](https://docs.microsoft.com/en-us/azure/cosmos-db/firewall-support)
3. Get User & Password for Cosmos DB [Doc](https://docs.microsoft.com/en-us/azure/cosmos-db/secure-access-to-data) 
4. Restore Developer Secrets on your local machine [Doc](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-2.2&tabs=windows) 
    - open command prompt
    - cd [project directory]
    - dotnet user-secrets set EventDB:UserName" "Username from 4"
    - dotnet user-secrets set EventDB:Password" "Password from 4"
5. npm install
6. dotnet run
7. Enjoy!
