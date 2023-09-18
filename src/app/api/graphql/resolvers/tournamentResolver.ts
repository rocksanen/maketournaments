import Tournament from "@/model/tournamentModel";
import {Rules} from "@/types/Rules";
import {User} from "@/types/User";
import {Match} from "@/types/Match";

interface CreateTournamentArgs {
    name: string;
    rules: Rules[];  // Update this with your Rules type definition if necessary
    date: string;
    players?: User[];  // Assuming this is an array of User IDs
    admin: User;       // Assuming this is the User ID of the admin
    matches?: Match[];  // Assuming this is an array of Match IDs
}

interface UpdateTournamentArgs {
    id: string;
    name?: string;
    rules?: Rules[];  // Update this with your Rules type definition if necessary
    date?: string;
    players?: User[];  // Array of User IDs
    admin?: User;      // User ID of the admin
    matches?: Match[];  // Array of Match IDs
}

const tournamentResolvers = {
    Query: {
        tournament: async (_: any, { id }: { id: string }) => {
            try {
                const tournament = await Tournament.findById(id);
                return tournament;
            } catch (error) {
                console.error("Failed to fetch tournament:", error);
                throw new Error('Failed to fetch tournament');
            }
        },
        
        allTournaments: async () => {
            try {
                const tournaments = await Tournament.find();
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
                });
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