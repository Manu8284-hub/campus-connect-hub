import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, TrendingUp, Plus, Settings } from "lucide-react";

const AdminDashboard = () => {
  const { clubs, events, addClub, addEvent } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const [clubForm, setClubForm] = useState({
    name: "",
    description: "",
    category: "",
    coordinator: "",
    image: "",
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    club: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    maxParticipants: "",
    image: "",
  });

  const totalMembers = clubs.reduce((sum, club) => sum + club.members, 0);
  const openEvents = events.filter(e => e.registrationOpen).length;

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    addClub({
      id: 0,
      name: clubForm.name,
      description: clubForm.description,
      category: clubForm.category,
      members: 0,
      coordinator: clubForm.coordinator,
      image: clubForm.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
    });
    toast({
      title: "Club Created!",
      description: `${clubForm.name} has been successfully created.`,
    });
    setClubForm({
      name: "",
      description: "",
      category: "",
      coordinator: "",
      image: "",
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      id: 0,
      title: eventForm.title,
      description: eventForm.description,
      club: eventForm.club,
      category: eventForm.category,
      date: eventForm.date,
      time: eventForm.time,
      venue: eventForm.venue,
      registrationOpen: true,
      currentParticipants: 0,
      maxParticipants: Number(eventForm.maxParticipants),
      image: eventForm.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    });
    toast({
      title: "Event Created!",
      description: `${eventForm.title} has been successfully created.`,
    });
    setEventForm({
      title: "",
      description: "",
      club: "",
      category: "",
      date: "",
      time: "",
      venue: "",
      maxParticipants: "",
      image: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-primary-foreground/90">Manage clubs, events, and members</p>
            </div>
            <Settings className="w-12 h-12 opacity-50" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clubs">Manage Clubs</TabsTrigger>
            <TabsTrigger value="events">Manage Events</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clubs.length}</div>
                  <p className="text-xs text-muted-foreground">Active clubs on campus</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMembers}</div>
                  <p className="text-xs text-muted-foreground">Students participating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{openEvents}</div>
                  <p className="text-xs text-muted-foreground">Currently accepting registrations</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New member joined Coding Club", time: "2 hours ago" },
                    { action: "HackFest 2024 registration opened", time: "5 hours ago" },
                    { action: "Drama Society event completed", time: "1 day ago" },
                    { action: "Photography Club created new album", time: "2 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <p className="text-sm">{activity.action}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clubs Management Tab */}
          <TabsContent value="clubs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Club
                </CardTitle>
                <CardDescription>Add a new club to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateClub} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clubName">Club Name *</Label>
                    <Input
                      id="clubName"
                      required
                      value={clubForm.name}
                      onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                      placeholder="Enter club name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clubDescription">Description *</Label>
                    <Textarea
                      id="clubDescription"
                      required
                      value={clubForm.description}
                      onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                      placeholder="Enter club description"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clubCategory">Category *</Label>
                      <Select
                        value={clubForm.category}
                        onValueChange={(value) => setClubForm({ ...clubForm, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                          <SelectItem value="Academic">Academic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clubCoordinator">Coordinator *</Label>
                      <Input
                        id="clubCoordinator"
                        required
                        value={clubForm.coordinator}
                        onChange={(e) => setClubForm({ ...clubForm, coordinator: e.target.value })}
                        placeholder="Coordinator name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clubImage">Image URL (Optional)</Label>
                    <Input
                      id="clubImage"
                      value={clubForm.image}
                      onChange={(e) => setClubForm({ ...clubForm, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <Button type="submit" className="w-full">Create Club</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Clubs</CardTitle>
                <CardDescription>Manage and edit clubs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clubs.slice(0, 5).map((club) => (
                    <div key={club.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="font-medium">{club.name}</p>
                        <p className="text-sm text-muted-foreground">{club.members} members</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Management Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Event
                </CardTitle>
                <CardDescription>Schedule a new event</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventTitle">Event Title *</Label>
                    <Input
                      id="eventTitle"
                      required
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDescription">Description *</Label>
                    <Textarea
                      id="eventDescription"
                      required
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      placeholder="Enter event description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventClub">Organizing Club *</Label>
                      <Select
                        value={eventForm.club}
                        onValueChange={(value) => setEventForm({ ...eventForm, club: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select club" />
                        </SelectTrigger>
                        <SelectContent>
                          {clubs.map((club) => (
                            <SelectItem key={club.id} value={club.name}>
                              {club.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventCategory">Category *</Label>
                      <Select
                        value={eventForm.category}
                        onValueChange={(value) => setEventForm({ ...eventForm, category: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Competition">Competition</SelectItem>
                          <SelectItem value="Seminar">Seminar</SelectItem>
                          <SelectItem value="Cultural">Cultural</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Date *</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        required
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventTime">Time *</Label>
                      <Input
                        id="eventTime"
                        required
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        placeholder="e.g., 2:00 PM - 5:00 PM"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventVenue">Venue *</Label>
                      <Input
                        id="eventVenue"
                        required
                        value={eventForm.venue}
                        onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        placeholder="Event location"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventMaxParticipants">Max Participants *</Label>
                      <Input
                        id="eventMaxParticipants"
                        type="number"
                        required
                        min="1"
                        value={eventForm.maxParticipants}
                        onChange={(e) => setEventForm({ ...eventForm, maxParticipants: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventImage">Image URL (Optional)</Label>
                    <Input
                      id="eventImage"
                      value={eventForm.image}
                      onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <Button type="submit" className="w-full">Create Event</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Manage scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.club}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Cancel</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
