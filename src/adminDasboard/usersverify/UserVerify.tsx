
import React, { useState, useEffect } from 'react';
import { getAllUsers, editUser, deleteUser } from '@/lib/usersverifyfunctions';
import { User, StudentData, StaffData, ExtendedUser } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Props {
  className?: string;
}

const UserVerify = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'staff' | 'student'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const { toast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editStudentData, setEditStudentData] = useState<StudentData>({
    studentId: '',
    name: '',
    class: '',
    number: '',
    description: '',
    englishName: '',
    motherName: '',
    fatherName: '',
    email: '',
    bloodGroup: '',
    photoUrl: '',
    nameBangla: '',
    nameEnglish: '',
    academicYear: '',
    section: '',
    shift: '',
  });
  const [editStaffData, setEditStaffData] = useState<StaffData>({
    staffId: '',
    nameBangla: '',
    nameEnglish: '',
    subject: '',
    designation: '',
    joiningDate: '',
    nid: '',
    mobile: '',
    salary: 0,
    email: '',
    address: '',
    bloodGroup: '',
    workingDays: 0,
    photoUrl: '',
  });

  const [emptyStudentData] = useState<StudentData>({
    studentId: '',
    name: '',
    class: '',
    number: '',
    description: '',
    englishName: '',
    motherName: '',
    fatherName: '',
    email: '',
    bloodGroup: '',
    photoUrl: '',
    nameBangla: '',
    nameEnglish: '',
    academicYear: '',
    section: '',
    shift: '',
  });

  const [emptyStaffData] = useState<StaffData>({
    staffId: '',
    nameBangla: '',
    nameEnglish: '',
    subject: '',
    designation: '',
    joiningDate: '',
    nid: '',
    mobile: '',
    salary: 0,
    email: '',
    address: '',
    bloodGroup: '',
    workingDays: 0,
    photoUrl: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const allUsers = await getAllUsers('student');
        const staffUsers = await getAllUsers('staff');
        const adminUsers = await getAllUsers('admin');
        setUsers([...allUsers, ...staffUsers, ...adminUsers]);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Failed to fetch users",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.studentData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.staffData?.nameBangla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.staffData?.nameEnglish?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'verified' && user.verified) ||
      (selectedStatus === 'unverified' && !user.verified);
    
    return matchesSearch && matchesRole && matchesStatus;
  }).map(user => ({
    ...user,
    joiningDate: user.staffData?.joiningDate 
      ? typeof user.staffData.joiningDate === 'string' 
        ? user.staffData.joiningDate 
        : new Date(user.staffData.joiningDate).toISOString().split('T')[0]
      : '',
    staffData: user.staffData ? {
      ...user.staffData,
      joiningDate: typeof user.staffData.joiningDate === 'string' 
        ? user.staffData.joiningDate 
        : new Date(user.staffData.joiningDate).toISOString().split('T')[0]
    } : undefined
  }));

  const handleVerifyUser = async (userId: string, verified: boolean) => {
    try {
      await editUser(userId, { verified: !verified });
      setUsers(users.map(user =>
        user.id === userId ? { ...user, verified: !user.verified } : user
      ));
      toast({
        title: "Success",
        description: `User ${verified ? 'unverified' : 'verified'} successfully`,
      });
    } catch (error: any) {
      console.error('Error verifying user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify user",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user",
      });
    }
  };

  const openEditModal = (user: ExtendedUser) => {
    setEditingUser(user);
    if (user.role === 'student') {
      setEditStudentData({
        studentId: user.studentData?.studentId || user.id,
        name: user.studentData?.name || '',
        class: user.studentData?.class || '',
        number: user.studentData?.number || '',
        description: user.studentData?.description || '',
        englishName: user.studentData?.englishName || '',
        motherName: user.studentData?.motherName || '',
        fatherName: user.studentData?.fatherName || '',
        email: user.studentData?.email || user.email || '',
        bloodGroup: user.studentData?.bloodGroup || '',
        photoUrl: user.studentData?.photoUrl || '',
        nameBangla: user.studentData?.nameBangla || '',
        nameEnglish: user.studentData?.nameEnglish || '',
        academicYear: user.studentData?.academicYear || '',
        section: user.studentData?.section || '',
        shift: user.studentData?.shift || '',
      });
    } else if (user.role === 'staff' || user.role === 'admin') {
      setEditStaffData({
        staffId: user.staffData?.staffId || user.id,
        nameBangla: user.staffData?.nameBangla || '',
        nameEnglish: user.staffData?.nameEnglish || '',
        subject: user.staffData?.subject || '',
        designation: user.staffData?.designation || '',
        joiningDate: typeof user.staffData?.joiningDate === 'string' 
          ? user.staffData.joiningDate 
          : user.staffData?.joiningDate 
            ? new Date(user.staffData.joiningDate).toISOString().split('T')[0]
            : '',
        nid: user.staffData?.nid || '',
        mobile: user.staffData?.mobile || '',
        salary: user.staffData?.salary || 0,
        email: user.staffData?.email || user.email || '',
        address: user.staffData?.address || '',
        bloodGroup: user.staffData?.bloodGroup || '',
        workingDays: user.staffData?.workingDays || 0,
        photoUrl: user.staffData?.photoUrl || '',
      });
    }
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      const updatedData: Partial<ExtendedUser> = {
        email: editingUser.email,
        role: editingUser.role,
        verified: editingUser.verified,
      };

      if (editingUser.role === 'student') {
        updatedData.studentData = {
          studentId: editStudentData.studentId,
          name: editStudentData.name,
          class: editStudentData.class,
          number: editStudentData.number,
          description: editStudentData.description,
          englishName: editStudentData.englishName,
          motherName: editStudentData.motherName,
          fatherName: editStudentData.fatherName,
          email: editStudentData.email,
          bloodGroup: editStudentData.bloodGroup,
          photoUrl: editStudentData.photoUrl,
          nameBangla: editStudentData.nameBangla,
          nameEnglish: editStudentData.nameEnglish,
          academicYear: editStudentData.academicYear,
          section: editStudentData.section,
          shift: editStudentData.shift,
        };
      } else if (editingUser.role === 'staff' || editingUser.role === 'admin') {
        updatedData.staffData = {
          staffId: editStaffData.staffId,
          nameBangla: editStaffData.nameBangla,
          nameEnglish: editStaffData.nameEnglish,
          subject: editStaffData.subject,
          designation: editStaffData.designation,
          joiningDate: editStaffData.joiningDate,
          nid: editStaffData.nid,
          mobile: editStaffData.mobile,
          salary: editStaffData.salary,
          email: editStaffData.email,
          address: editStaffData.address,
          bloodGroup: editStaffData.bloodGroup,
          workingDays: editStaffData.workingDays,
          photoUrl: editStaffData.photoUrl,
        };
      }

      await editUser(editingUser.id, updatedData);
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...updatedData } : user
      ));
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <Input
          type="text"
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-auto"
        />
        <div className="flex gap-2">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>A list of all users in your account.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.studentData?.name || user.staffData?.nameBangla || user.staffData?.nameEnglish || 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={user.verified ? "outline" : "secondary"}>
                    {user.verified ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleVerifyUser(user.id, user.verified)}
                    >
                      {user.verified ? 'Unverify' : 'Verify'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editingUser.email || ''}
                  className="col-span-3"
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="verified" className="text-right">
                  Verified
                </Label>
                <Checkbox
                  id="verified"
                  checked={editingUser.verified}
                  onCheckedChange={(checked) =>
                    setEditingUser({ ...editingUser, verified: !!checked })
                  }
                />
              </div>
              {editingUser.role === 'student' && (
                <>
                  <h2 className="text-lg font-semibold">Student Data</h2>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editStudentData.name}
                      className="col-span-3"
                      onChange={(e) =>
                        setEditStudentData({ ...editStudentData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="class" className="text-right">
                      Class
                    </Label>
                    <Input
                      id="class"
                      value={editStudentData.class}
                      className="col-span-3"
                      onChange={(e) =>
                        setEditStudentData({ ...editStudentData, class: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="number" className="text-right">
                      Number
                    </Label>
                    <Input
                      id="number"
                      value={editStudentData.number}
                      className="col-span-3"
                      onChange={(e) =>
                        setEditStudentData({ ...editStudentData, number: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nameBangla" className="text-right">
                      Name Bangla
                    </Label>
                    <Input
                      id="nameBangla"
                      value={editStudentData.nameBangla}
                      className="col-span-3"
                      onChange={(e) =>
                        setEditStudentData({ ...editStudentData, nameBangla: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nameEnglish" className="text-right">
                      Name English
                    </Label>
                    <Input
                      id="nameEnglish"
                      value={editStudentData.nameEnglish}
                      className="col-span-3"
                      onChange={(e) =>
                        setEditStudentData({ ...editStudentData, nameEnglish: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
              {(editingUser.role === 'staff' || editingUser.role === 'admin') && (
                <>
                  <h2 className="text-lg font-semibold">Staff Data</h2>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nameBangla" className="text-right">
                      Name Bangla
                    </Label>
                    <Input
                      id="nameBangla"
                      value={editStaffData.nameBangla}
                      className="col-span-3"
                      onChange={(e) =>
                        setEditStaffData({ ...editStaffData, nameBangla: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nameEnglish" className="text-right">
                      Name English
                    </Label>
                    <Input
                      id="nameEnglish"
                      value={editStaffData.nameEnglish}
                      className="col-span-3"
                      onChange={(e) =>
                        setEditStaffData({ ...editStaffData, nameEnglish: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="designation" className="text-right">
                      Designation
                    </Label>
                    <Input
                      id="designation"
                      value={editStaffData.designation}
                      className="col-span-3"
                      onChange={(e) =>
                        setEditStaffData({ ...editStaffData, designation: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateUser} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserVerify;
