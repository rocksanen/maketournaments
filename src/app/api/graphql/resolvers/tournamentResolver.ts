import Tournament from "@/model/tournamentModel";

interface CreateTournamentArgs {
    name: string;
    rules: any[];  // Update this with your Rules type definition if necessary
    date: string;
    players?: string[];  // Assuming this is an array of User IDs
    admin: string;       // Assuming this is the User ID of the admin
    matches?: string[];  // Assuming this is an array of Match IDs
}

interface UpdateTournamentArgs {
    id: string;
    name?: string;
    rules?: any[];  // Update this with your Rules type definition if necessary
    date?: string;
    players?: string[];  // Array of User IDs
    admin?: string;      // User ID of the admin
    matches?: string[];  // Array of Match IDs
}

const tournamentResolvers = {
    Query: {
        tournament: async (_: any, { id }: { id: string }) => {
            try {
                const tournament = await Tournament.findById(id).populate('players admin matches');
                return tournament;
            } catch (error) {
                console.error("Failed to fetch tournament:", error);
                throw new Error('Failed to fetch tournament');
            }
        },
        
        allTournaments: async () => {
            try {
                const tournaments = await Tournament.find().populate('players admin matches');
                return tournaments;
            } catch (error) {
                console.error("Failed to fetch tournaments:", error);
                throw new Error('Failed to fetch tournaments');
            }
        },
    },

    Mutation: {
        createTournament: async (_: any, args: CreateTournamentArgs) => {
            try {
                const newTournament = new Tournament(args);
                const result = await newTournament.save();
                return result;
            } catch (error) {
                console.error("Failed to create tournament:", error);
                throw new Error('Failed to create tournament');
            }
        },

        updateTournament: async (_: any, { id, ...args }: UpdateTournamentArgs) => {
            try {
                const updatedTournament = await Tournament.findByIdAndUpdate(id, args, {
                    new: true
                }).populate('players admin matches');
                return updatedTournament;
            } catch (error) {
                console.error("Failed to update tournament:", error);
                throw new Error('Failed to update tournament');
            }
        },

        deleteTournament: async (_: any, { id }: { id: string }) => {
            try {
                const deletedTournament = await Tournament.findByIdAndRemove(id);
                if (!deletedTournament) {
                    throw new Error('Tournament not found');
                }
                return deletedTournament;
            } catch (error) {
                console.error("Failed to delete tournament:", error);
                throw new Error('Failed to delete tournament');
            }
        }
    }
};