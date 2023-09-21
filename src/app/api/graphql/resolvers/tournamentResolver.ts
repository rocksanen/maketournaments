import Tournament from "@/model/tournamentModel";
import {Rules} from "@/types/Rules";
import {User} from "@/types/User";
import {Match} from "@/types/Match";
import {renameIdField} from "@/utils/idCon";

interface CreateTournamentArgs {
    input: {
        name: string;
        rules: Rules[];
        date: string;
        players?: User[];
        admin: User;
        matches?: Match[];
    }
}

interface UpdateTournamentArgs {
    input: {
        id: string;
        name?: string;
        rules?: Rules[];
        date?: string;
        players?: User[];
        admin?: User;
        matches?: Match[];
    }
}

const tournamentResolvers = {
    Query: {
        tournament: async (_: any, { id }: { id: string }) => {
            try {
                const tournament = await Tournament.findById(id).populate('rules admin players matches');;
                return tournament;
            } catch (error) {
                console.error("Failed to fetch tournament:", error);
                throw new Error('Failed to fetch tournament');
            }
        },
        
        allTournaments: async () => {
            try {
                const tournaments = await Tournament.find().populate('rules admin players matches');;
                return tournaments;
            } catch (error) {
                console.error("Failed to fetch tournaments:", error);
                throw new Error('Failed to fetch tournaments');
            }
        },
    },

    Mutation: {
        createTournament: async (_: any, { input }: CreateTournamentArgs) => {
            try {
                // If you're storing references in the Tournament model, extract IDs
                const adminId = input.admin;
                const playerIds = input.players?.map(player => player.id);
        
                const newTournament = new Tournament({
                    ...input,
                    admin: adminId,
                    players: playerIds
                });
        
                const savedTournament = await newTournament.save();
        
                // Use the Model to fetch and populate the document
                const result = await Tournament.findById(savedTournament._id).populate('rules admin players matches');
                

                if (!result) {
                    throw new Error('Failed to retrieve and populate saved tournament');
                }

                const resultObj = result.toJSON();
                const out = renameIdField(resultObj);

                return out;
            } catch (error) {
                console.error("Failed to create tournament:", error);
                throw new Error('Failed to create tournament');
            }
        },

        updateTournament: async (_: any, args: UpdateTournamentArgs) => {
            const { id, ...inputData } = args.input;
        
            try {
                if (inputData.admin) {
                    inputData.admin = inputData.admin.id; // Convert to ID if it's an object
                }
                if (inputData.players) {
                    inputData.players = inputData.players.map(player => player.id); // Convert array of objects to array of IDs
                }
                const updatedTournament = await Tournament.findByIdAndUpdate(id, inputData, {
                    new: true
                }).populate('rules admin players matches');

                const resultObj = updatedTournament.toJSON();
                const out = renameIdField(resultObj);

                return out;
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

                return true;
            } catch (error) {
                console.error("Failed to delete tournament:", error);
                throw new Error('Failed to delete tournament');
            }
        }
    }
};

export default tournamentResolvers;